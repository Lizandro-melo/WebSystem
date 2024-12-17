package br.com.grupoqualityambiental.backend.dto.auth;

import br.com.grupoqualityambiental.backend.models.colaborador.EmpresaColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.SetorColaboradorModel;

import java.time.LocalDate;

public record Register(String nomeCompleto, String nomeContato, String emailCorporativo, String cpf, String login, String email,
                          String nCelular, String cep, LocalDate dataNascimento, String tipo, LocalDate dataAdmissao,
                          EmpresaColaboradorModel empresa, SetorColaboradorModel setor) {
}
