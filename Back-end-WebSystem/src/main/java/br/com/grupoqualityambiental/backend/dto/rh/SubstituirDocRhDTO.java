package br.com.grupoqualityambiental.backend.dto.rh;

import br.com.grupoqualityambiental.backend.models.rh.DocRhModels;

public record SubstituirDocRhDTO(DocRhModels docExistente, DocRhModels docSubstituto) {
}