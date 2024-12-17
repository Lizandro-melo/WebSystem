package br.com.grupoqualityambiental.backend.repository.ti;

import br.com.grupoqualityambiental.backend.models.ti.CategoriaClassificacaoTiModels;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaClassificacaoTiRepository extends JpaRepository<CategoriaClassificacaoTiModels, Long> {
    List<CategoriaClassificacaoTiModels> findByReferentGrupo_id(Integer idGrupo);

    List<CategoriaClassificacaoTiModels> findByReferentGrupo_idAndStatus(Integer idGrupo, boolean b);
}
