package br.com.grupoqualityambiental.backend.repository.colaborador;

import br.com.grupoqualityambiental.backend.models.colaborador.AlergiaColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.ContatoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlergiaColaboradorRepository extends JpaRepository<AlergiaColaboradorModel, Long> {


    List<AlergiaColaboradorModel> findAllByColaboradorReferent_fkAuth(Integer idColaborador);

    void deleteByColaboradorReferent_fkAuth(Long fkAuth);
}
