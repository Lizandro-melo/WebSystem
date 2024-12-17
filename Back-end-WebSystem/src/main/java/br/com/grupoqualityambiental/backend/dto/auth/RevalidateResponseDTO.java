package br.com.grupoqualityambiental.backend.dto.auth;

import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;

public record RevalidateResponseDTO(InfoColaboradorModel user, AcessoModel acessos, Boolean alterPass) {
}
