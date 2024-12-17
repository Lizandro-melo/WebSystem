package br.com.grupoqualityambiental.backend.repository.rh;

import br.com.grupoqualityambiental.backend.models.rh.CandidatosRhModel;
import br.com.grupoqualityambiental.backend.models.rh.ConfigVotacaoRhModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfigVotacaoRhRepository extends JpaRepository<ConfigVotacaoRhModel, Long> {
}
