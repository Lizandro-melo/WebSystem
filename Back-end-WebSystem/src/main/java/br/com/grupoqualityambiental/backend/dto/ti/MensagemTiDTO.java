package br.com.grupoqualityambiental.backend.dto.ti;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.MensagemTiEnum;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.ti.MensagemTiModels;

import java.time.LocalDateTime;

public record MensagemTiDTO(Long id, Long referentSolicitacao, String mensagem, MensagemTiEnum status,
                            InfoColaboradorModel responsavel, LocalDateTime dataHora, String anexos) {

    public MensagemTiDTO(MensagemTiModels mensagem, InfoColaboradorModel responsavel) {
        this(
                mensagem.getId(),
                mensagem.getReferentSolicitacao().getId(),
                mensagem.getMensagem(),
                mensagem.getStatus(),
                responsavel,
                mensagem.getDataHora(),
                mensagem.getAnexos()
        );
    }
}
