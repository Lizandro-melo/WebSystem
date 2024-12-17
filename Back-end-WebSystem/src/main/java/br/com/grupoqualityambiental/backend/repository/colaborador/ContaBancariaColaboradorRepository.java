package br.com.grupoqualityambiental.backend.repository.colaborador;

import br.com.grupoqualityambiental.backend.models.colaborador.ContaBancariaColaboradorModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContaBancariaColaboradorRepository extends JpaRepository<ContaBancariaColaboradorModel, Long> {
    List<ContaBancariaColaboradorModel> findAllByColaboradorReferent_fkAuth(Integer idColaborador);

    void deleteByColaboradorReferent_fkAuth(Long fkAuth);
}
