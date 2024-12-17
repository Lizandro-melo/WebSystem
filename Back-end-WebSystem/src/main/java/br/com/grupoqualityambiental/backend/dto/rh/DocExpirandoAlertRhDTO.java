package br.com.grupoqualityambiental.backend.dto.rh;

import br.com.grupoqualityambiental.backend.models.rh.DocRhModels;

public record DocExpirandoAlertRhDTO(DocRhModels doc, Long diasRestantes) {
}
