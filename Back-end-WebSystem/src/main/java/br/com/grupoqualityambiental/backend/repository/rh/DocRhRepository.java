package br.com.grupoqualityambiental.backend.repository.rh;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.TipoDocRhEnum;
import br.com.grupoqualityambiental.backend.models.rh.DocRhModels;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocRhRepository extends JpaRepository<DocRhModels, Long> {

    List<DocRhModels> findByReferentColaborador(Integer referentColaborador);

    DocRhModels findByReferentColaboradorAndTipo(Integer referentColaborador, TipoDocRhEnum tipo);
}
