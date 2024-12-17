package br.com.grupoqualityambiental.backend.dto.colaborador;

import br.com.grupoqualityambiental.backend.models.colaborador.*;

import java.util.List;

public record InfoColaboradorCompletoDTO(AuthColaboradorModel authColaborador, InfoColaboradorModel infoPessoais,
                                         List<ContatoColaboradorModel> contatos,
                                         List<AlergiaColaboradorModel> alergias,
                                         List<ContaBancariaColaboradorModel> contasBancarias,
                                         InfoCLTColaboradorModel infoCLT, InfoEstagiarioColaboradorModel infoEstagiario,
                                         InfoMEIColaboradorModel infoMEI) {
}
