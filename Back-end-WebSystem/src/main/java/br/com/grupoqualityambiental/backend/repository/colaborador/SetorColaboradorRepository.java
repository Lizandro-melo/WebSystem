package br.com.grupoqualityambiental.backend.repository.colaborador;

import br.com.grupoqualityambiental.backend.models.colaborador.SetorColaboradorModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SetorColaboradorRepository extends JpaRepository<SetorColaboradorModel, Long> {
}
