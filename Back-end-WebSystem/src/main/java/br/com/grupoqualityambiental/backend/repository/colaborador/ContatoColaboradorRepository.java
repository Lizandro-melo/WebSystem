package br.com.grupoqualityambiental.backend.repository.colaborador;

import br.com.grupoqualityambiental.backend.models.colaborador.ContatoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContatoColaboradorRepository extends JpaRepository<ContatoColaboradorModel, InfoColaboradorModel> {
    List<ContatoColaboradorModel> findAllByColaboradorReferent_fkAuth(Integer idColaborador);


    void deleteByColaboradorReferent_fkAuth(Long fkAuth);
}
