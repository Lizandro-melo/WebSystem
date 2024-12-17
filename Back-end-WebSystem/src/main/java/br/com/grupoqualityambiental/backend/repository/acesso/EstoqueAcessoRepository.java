package br.com.grupoqualityambiental.backend.repository.acesso;

import br.com.grupoqualityambiental.backend.models.acesso.EstoqueAcessoModel;
import br.com.grupoqualityambiental.backend.models.acesso.RhAcessoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstoqueAcessoRepository extends JpaRepository<EstoqueAcessoModel, Long> {
}
