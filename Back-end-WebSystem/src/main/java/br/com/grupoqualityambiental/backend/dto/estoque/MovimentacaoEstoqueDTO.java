package br.com.grupoqualityambiental.backend.dto.estoque;

import br.com.grupoqualityambiental.backend.models.estoque.ItemSolicitadoEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.MovimentacaoEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.SolicitacaoEstoqueModel;

import java.util.List;

public record MovimentacaoEstoqueDTO(MovimentacaoEstoqueModel movimentacao, String nomeResponsavel) {

}