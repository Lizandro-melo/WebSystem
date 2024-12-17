package br.com.grupoqualityambiental.backend.dto.auth;

import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;

public record LoginResponse(String token, String mensagem, InfoColaboradorModel user, AcessoModel acessos, Boolean alterPass) {
}
