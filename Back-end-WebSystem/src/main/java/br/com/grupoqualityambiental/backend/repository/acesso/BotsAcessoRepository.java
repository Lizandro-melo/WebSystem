package br.com.grupoqualityambiental.backend.repository.acesso;

import br.com.grupoqualityambiental.backend.models.acesso.DiversosAcessoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BotsAcessoRepository extends JpaRepository<DiversosAcessoModel, Long> {
}
