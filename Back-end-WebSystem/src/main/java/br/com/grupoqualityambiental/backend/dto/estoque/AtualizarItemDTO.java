package br.com.grupoqualityambiental.backend.dto.estoque;

import br.com.grupoqualityambiental.backend.models.estoque.ItemEstoqueModel;

public record AtualizarItemDTO(ItemEstoqueModel item, Long idColaborador) {
}
