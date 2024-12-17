package br.com.grupoqualityambiental.backend.service.estoque;

import br.com.grupoqualityambiental.backend.dto.estoque.AtualizarItemDTO;
import br.com.grupoqualityambiental.backend.dto.estoque.SolicitacaoItensEstoqueDTO;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.estoque.ItemEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.ItemSolicitadoEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.MovimentacaoEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.SolicitacaoEstoqueModel;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.estoque.*;
import br.com.grupoqualityambiental.backend.service.notificacao.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UpdateEstoqueService {

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
    private InfoColaboradorRepository infoColaboradorRepository;
    @Autowired
    private NotificacaoService notificacaoService;

    public String darBaixa(List<SolicitacaoItensEstoqueDTO> solicitacoes) throws IntegridadeDadosException {
        for (SolicitacaoItensEstoqueDTO solicitacao : solicitacoes) {
            solicitacao.solicitacao().setStatus(false);
            solicitacaoEstoqueRepository.save(solicitacao.solicitacao());
        }
        for (SolicitacaoItensEstoqueDTO solicitacao : solicitacoes) {
            notificacaoService.createNotificationColaboradorIntension("Itens disponiveis!", "Os itens que você solicitou já estão disponiveis!", solicitacao.solicitacao().getSolicitante().intValue(), "estoque");
        }
        return "Solicitações baixadas!";
    }

    public String deletarSolicitacao(Integer id) {
        SolicitacaoEstoqueModel solicitacao = solicitacaoEstoqueRepository.findById(id.longValue()).get();
        for (ItemSolicitadoEstoqueModel item : itemSolicitacaoEstoqueRepository.findBySolicitacao_id(id.longValue())) {
            ItemEstoqueModel itemReferent = itemEstoqueRepository.findById(item.getItem().getId()).get();
            itemReferent.setQuantidade(itemReferent.getQuantidade() + item.getQuantidade());
            itemEstoqueRepository.save(itemReferent);
            itemSolicitacaoEstoqueRepository.delete(item);
        }
        movimentacaoEstoqueRepository.deleteAll(movimentacaoEstoqueRepository.findBySolicitacao_id(id.longValue()));
        solicitacaoEstoqueRepository.delete(solicitacao);
        return "Solicitação deletada com sucesso!";
    }

    public String atualizarItem(AtualizarItemDTO itemAtualizar) throws IntegridadeDadosException {
        MovimentacaoEstoqueModel movimentacao = new MovimentacaoEstoqueModel();
        ItemEstoqueModel itemReferent = itemEstoqueRepository.findById(itemAtualizar.item().getId()).get();
        movimentacao.setResponsavel(itemAtualizar.idColaborador());
        movimentacao.setItem(itemReferent);
        movimentacao.setDataHora(LocalDateTime.now());
        Integer quantidadeAlterada = itemAtualizar.item().getQuantidade() - itemReferent.getQuantidade();
        if (quantidadeAlterada < 0) {
            quantidadeAlterada = quantidadeAlterada * -1;
        }
        movimentacao.setQuantidade(quantidadeAlterada);
        if (itemAtualizar.item().getQuantidade() < 0) {
            throw new IntegridadeDadosException("Um item não pode ter sua quantidade negativada!");
        }
        if (itemAtualizar.item().getQuantidade() < itemReferent.getQuantidade()) {
            movimentacao.setTipo("saida");
            movimentacaoEstoqueRepository.save(movimentacao);
        } else {
            movimentacao.setTipo("entrada");
            movimentacaoEstoqueRepository.save(movimentacao);
        }
        itemEstoqueRepository.save(itemAtualizar.item());
        return "Item atualizado com sucesso!";
    }

    public String desativarItem(ItemEstoqueModel item) {
        item.setStatus(false);
        itemEstoqueRepository.save(item);
        return "Item desativado com sucesso!";
    }

    public String ativarItem(ItemEstoqueModel item) {
        item.setStatus(true);
        itemEstoqueRepository.save(item);
        return "Item ativado com sucesso!";
    }
}
