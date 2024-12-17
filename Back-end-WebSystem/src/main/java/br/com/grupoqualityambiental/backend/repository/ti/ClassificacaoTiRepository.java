package br.com.grupoqualityambiental.backend.repository.ti;

import br.com.grupoqualityambiental.backend.models.ti.ClassificacaoTiModels;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassificacaoTiRepository extends JpaRepository<ClassificacaoTiModels, Long> {
    ClassificacaoTiModels findByReferentSolicitacao_id(Integer id);
}
