package br.com.grupoqualityambiental.backend.dto.ti;

public record RequestClassificarDTO(Integer referentGrupo,
                                    Integer referentCategoria,
                                    Integer referentSubcategoria,
                                    Integer referentSolicitacao,
                                    Integer responsavel,
                                    String observacao) {
}
