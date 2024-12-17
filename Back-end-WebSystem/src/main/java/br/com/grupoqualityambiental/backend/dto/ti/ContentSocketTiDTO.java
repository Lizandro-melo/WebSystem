package br.com.grupoqualityambiental.backend.dto.ti;

import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.ti.SolicitacaoTiModels;

public record ContentSocketTiDTO(Long id, SolicitacaoTiModels solicitacao, InfoColaboradorModel user) {
}
