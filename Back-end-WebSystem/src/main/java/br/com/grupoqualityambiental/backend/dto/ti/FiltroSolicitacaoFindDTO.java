package br.com.grupoqualityambiental.backend.dto.ti;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.SolicitacaoTiEnum;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record FiltroSolicitacaoFindDTO(Integer idSolicitacao, Integer solicitante, String tipo, String motivo,LocalDate dataInicio, LocalDate dataFinal) {

}
