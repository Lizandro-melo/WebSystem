package br.com.grupoqualityambiental.backend.repository.ti;

import br.com.grupoqualityambiental.backend.models.ti.CategoriaClassificacaoTiModels;
import br.com.grupoqualityambiental.backend.models.ti.MensagemTiModels;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensagemTiRepository extends JpaRepository<MensagemTiModels, Long> {
    List<MensagemTiModels> findByReferentSolicitacao_id(Long id);
}
