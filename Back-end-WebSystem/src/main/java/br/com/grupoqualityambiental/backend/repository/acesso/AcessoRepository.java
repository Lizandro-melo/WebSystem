package br.com.grupoqualityambiental.backend.repository.acesso;

import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AcessoRepository extends JpaRepository<AcessoModel, Long> {
    AcessoModel findByReferentColaborador(long l);

    List<AcessoModel> findByRolesTI_delegado(boolean b);

    List<AcessoModel> findByRolesEstoque_solicitacoes(boolean b);
}
