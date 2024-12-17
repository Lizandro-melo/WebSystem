package br.com.grupoqualityambiental.backend.dto.rh;

import br.com.grupoqualityambiental.backend.dto.colaborador.InfoColaboradorCompletoDTO;
import br.com.grupoqualityambiental.backend.models.rh.AnotacaoRhModels;

import java.util.List;

public record ResponseFindAnotacaoRhDTO(InfoColaboradorCompletoDTO infoColaborador, List<AnotacaoRhModels> anotacoes,
                                        ContabilizacaoDadosAnotacao dadosContabilizados) {
}
