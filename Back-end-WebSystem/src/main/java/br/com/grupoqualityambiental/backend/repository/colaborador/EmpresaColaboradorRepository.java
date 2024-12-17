package br.com.grupoqualityambiental.backend.repository.colaborador;

import br.com.grupoqualityambiental.backend.models.colaborador.EmpresaColaboradorModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaColaboradorRepository extends JpaRepository<EmpresaColaboradorModel, Long> {
}
