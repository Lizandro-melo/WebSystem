package br.com.grupoqualityambiental.backend.dto.ti;

import java.util.List;

public record ResponseSocketSolicitacaoTiDTO(SolicitacaoTiDTO solicitacao,
                                             List<MensagemTiDTO> mensagens) {
}
