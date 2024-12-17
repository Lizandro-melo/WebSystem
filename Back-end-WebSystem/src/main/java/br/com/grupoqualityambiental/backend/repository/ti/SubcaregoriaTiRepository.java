package br.com.grupoqualityambiental.backend.repository.ti;

import br.com.grupoqualityambiental.backend.models.ti.CategoriaClassificacaoTiModels;
import br.com.grupoqualityambiental.backend.models.ti.SubcategoriaTiModels;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubcaregoriaTiRepository extends JpaRepository<SubcategoriaTiModels, Long> {


    List<SubcategoriaTiModels> findByReferentCategoria_idAndStatus(Integer idCategoria, boolean b);
}
