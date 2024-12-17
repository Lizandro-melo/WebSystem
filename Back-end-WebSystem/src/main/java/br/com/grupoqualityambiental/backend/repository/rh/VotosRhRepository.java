package br.com.grupoqualityambiental.backend.repository.rh;

import br.com.grupoqualityambiental.backend.models.rh.VotosRhModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VotosRhRepository extends JpaRepository<VotosRhModel, Long> {
}
