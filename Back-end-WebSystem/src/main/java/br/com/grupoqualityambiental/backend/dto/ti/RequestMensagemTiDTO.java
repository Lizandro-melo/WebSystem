package br.com.grupoqualityambiental.backend.dto.ti;

public record RequestMensagemTiDTO(Integer referentSolicitacao, Integer responsavel, String mensagem, String anexos) {
}
