package br.com.grupoqualityambiental.backend.service.estoque;

import br.com.grupoqualityambiental.backend.dto.estoque.SolicitacaoItensEstoqueDTO;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.estoque.CategoriaEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.ItemEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.ItemSolicitadoEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.MovimentacaoEstoqueModel;
import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.estoque.*;
import br.com.grupoqualityambiental.backend.service.notificacao.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CreateEstoqueService {

    @Autowired
    private ItemEstoqueRepository itemEstoqueRepository;
    @Autowired
    private SolicitacaoEstoqueRepository solicitacaoEstoqueRepository;
    @Autowired
    private CategoriaEstoqueRepository categoriaEstoqueRepository;
    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    @Autowired
    private ItemSolicitacaoEstoqueRepository itemSolicitacaoEstoqueRepository;
    @Autowired
    private AcessoRepository acessoRepository;
    @Autowired
    private NotificacaoService notificacaoService;

    public String createSolicitacaoEstoque(SolicitacaoItensEstoqueDTO solicitacao) throws IntegridadeDadosException {
        if(solicitacao.solicitacao().getPrioridade() == null){
            solicitacao.solicitacao().setPrioridade("baixa");
        }
        if (solicitacao.solicitacao().getPrioridade().equals("alta") && solicitacao.solicitacao().getMensagem().isEmpty()) {
            throw new IntegridadeDadosException("Obrigatorio entrar com um motivo!");
        }
        if (solicitacao.itens().isEmpty()) {
            throw new IntegridadeDadosException("Sem itens");
        }

        solicitacao.solicitacao().setStatus(true);
        solicitacao.solicitacao().setDataHora(LocalDateTime.now());
        solicitacaoEstoqueRepository.save(solicitacao.solicitacao());
        for (ItemSolicitadoEstoqueModel item : solicitacao.itens()) {
            if (item.getQuantidade() <= 0) {
                throw new IntegridadeDadosException("Existem itens com valores negativos em sua cesta!");
            }
            item.setSolicitacao(solicitacao.solicitacao());
            ItemEstoqueModel itemReferente = itemEstoqueRepository.findById(item.getItem().getId()).get();
            itemReferente.setQuantidade(itemReferente.getQuantidade() - item.getQuantidade());
            MovimentacaoEstoqueModel movimentacao = new MovimentacaoEstoqueModel();
            movimentacao.setItem(itemReferente);
            movimentacao.setSolicitacao(solicitacao.solicitacao());
            movimentacao.setDataHora(LocalDateTime.now());
            movimentacao.setQuantidade(item.getQuantidade());
            movimentacao.setResponsavel(solicitacao.solicitacao().getSolicitante());
            movimentacao.setTipo("saida");
            movimentacaoEstoqueRepository.save(movimentacao);
            itemEstoqueRepository.save(itemReferente);
            itemSolicitacaoEstoqueRepository.save(item);
        }
        for (AcessoModel acesso : acessoRepository.findByRolesEstoque_solicitacoes(true)) {
            notificacaoService.createNotificationColaboradorIntension("Novos itens foram solicitados!", "Você pode verficar os itens solicitados em 'Solicitações' na parte de estoque.", acesso.getReferentColaborador().intValue(), "estoque");
        }
        return "Solicitacão feita, aguarde até que seus itens fiquem disponiveis!";
    }
}
