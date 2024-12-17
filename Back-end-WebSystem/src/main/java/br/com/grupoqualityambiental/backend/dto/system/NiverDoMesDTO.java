package br.com.grupoqualityambiental.backend.dto.system;

import java.time.LocalDate;

public record NiverDoMesDTO(String nome, LocalDate dataNascimento, String img) {
}
