package br.com.grupoqualityambiental.backend.service.estoque;

import br.com.grupoqualityambiental.backend.dto.estoque.MovimentacaoEstoqueDTO;
import br.com.grupoqualityambiental.backend.dto.estoque.SolicitacaoItensEstoqueDTO;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.estoque.*;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.estoque.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FindEstoqueService {

    @Autowired
    private ItemEstoqueRepository itemEstoqueRepository;
    @Autowired
    private SolicitacaoEstoqueRepository solicitacaoEstoqueRepository;
    @Autowired
    private CategoriaEstoqueRepository categoriaEstoqueRepository;
    @Autowired
    private ItemSolicitacaoEstoqueRepository itemSolicitacaoEstoqueRepository;
    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;
    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    public List<ItemEstoqueModel> findAllItensFilter(String nome, String categoria) {
        return itemEstoqueRepository.findByNomeContainingIgnoreCaseAndCategoria_nomeContainingIgnoreCase(nome, categoria);
    }

    public List<CategoriaEstoqueModel> findAllCategorias() {
        return categoriaEstoqueRepository.findByStatus(true);
    }

    public List<SolicitacaoItensEstoqueDTO> getAllSolicitacoes() {
        List<SolicitacaoItensEstoqueDTO> solicitacoes = new ArrayList<>();
        for (SolicitacaoEstoqueModel solicitacao : solicitacaoEstoqueRepository.findAll()) {
            InfoColaboradorModel colaborador = infoColaboradorRepository.findById(solicitacao.getSolicitante()).get();
            List<ItemSolicitadoEstoqueModel> itens = itemSolicitacaoEstoqueRepository.findBySolicitacao_id(solicitacao.getId());
            solicitacoes.add(new SolicitacaoItensEstoqueDTO(solicitacao, itens, colaborador.getNomeCompleto()));
        }
        return solicitacoes;
    }

    public List<SolicitacaoItensEstoqueDTO> getMySolicitacoes(Integer id) {
        List<SolicitacaoItensEstoqueDTO> solicitacoes = new ArrayList<>();
        for (SolicitacaoEstoqueModel solicitacao : solicitacaoEstoqueRepository.findBySolicitante(id)) {
            InfoColaboradorModel colaborador = infoColaboradorRepository.findById(solicitacao.getSolicitante()).get();
            List<ItemSolicitadoEstoqueModel> itens = itemSolicitacaoEstoqueRepository.findBySolicitacao_id(solicitacao.getId());
            solicitacoes.add(new SolicitacaoItensEstoqueDTO(solicitacao, itens, colaborador.getNomeCompleto()));
        }
        return solicitacoes;
    }

    public List<MovimentacaoEstoqueDTO> getAllMovimentacoes() {
        List<MovimentacaoEstoqueDTO> movimentacoes = new ArrayList<>();
        for (MovimentacaoEstoqueModel movimentacao : movimentacaoEstoqueRepository.findAll()) {
            movimentacoes.add(new MovimentacaoEstoqueDTO(movimentacao, infoColaboradorRepository.findById(movimentacao.getResponsavel()).get().getNomeCompleto()));
        }
        return movimentacoes;
    }

    public List<ItemEstoqueModel> getAllAlert(){
        List<ItemEstoqueModel> itensAlert = new ArrayList<>();
        for (ItemEstoqueModel item : itemEstoqueRepository.findAll()){
            if (item.getQuantidade() <= 0){
                itensAlert.add(item);
            }
        }
        return itensAlert;
    }
}
