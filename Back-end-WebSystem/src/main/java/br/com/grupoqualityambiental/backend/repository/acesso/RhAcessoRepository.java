package br.com.grupoqualityambiental.backend.repository.acesso;

import br.com.grupoqualityambiental.backend.models.acesso.RhAcessoModel;
import br.com.grupoqualityambiental.backend.models.acesso.TiAcessoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RhAcessoRepository extends JpaRepository<RhAcessoModel, Long> {
}
