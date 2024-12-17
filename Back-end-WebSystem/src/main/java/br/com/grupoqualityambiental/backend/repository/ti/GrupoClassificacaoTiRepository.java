package br.com.grupoqualityambiental.backend.repository.ti;

import br.com.grupoqualityambiental.backend.models.ti.CategoriaClassificacaoTiModels;
import br.com.grupoqualityambiental.backend.models.ti.GrupoClassificacaoTiModels;
import br.com.grupoqualityambiental.backend.models.ti.SubcategoriaTiModels;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrupoClassificacaoTiRepository extends JpaRepository<GrupoClassificacaoTiModels, Long> {

    List<GrupoClassificacaoTiModels> findAllByStatus(boolean b);
}
