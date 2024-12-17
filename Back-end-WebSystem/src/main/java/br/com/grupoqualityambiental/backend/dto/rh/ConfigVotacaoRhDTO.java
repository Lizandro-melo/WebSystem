package br.com.grupoqualityambiental.backend.dto.rh;

import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.rh.CandidatosRhModel;
import br.com.grupoqualityambiental.backend.models.rh.ConfigVotacaoRhModel;

import java.util.List;

public record ConfigVotacaoRhDTO(ConfigVotacaoRhModel config, List<InfoColaboradorModel> candidatos) {
}
