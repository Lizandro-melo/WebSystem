package br.com.grupoqualityambiental.backend.repository.acesso;

import br.com.grupoqualityambiental.backend.models.acesso.TiAcessoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TiAcessoRepository extends JpaRepository<TiAcessoModel, Long> {
}
