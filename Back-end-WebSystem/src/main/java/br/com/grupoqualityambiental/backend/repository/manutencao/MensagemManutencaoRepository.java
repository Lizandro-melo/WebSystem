package br.com.grupoqualityambiental.backend.repository.manutencao;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.grupoqualityambiental.backend.models.manutencao.MensagemManutencaoModels;

public interface MensagemManutencaoRepository extends JpaRepository<MensagemManutencaoModels, Long> {

}
