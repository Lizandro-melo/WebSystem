package br.com.grupoqualityambiental.backend.repository.estoque;

import br.com.grupoqualityambiental.backend.models.estoque.ItemEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.ItemSolicitadoEstoqueModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemSolicitacaoEstoqueRepository extends JpaRepository<ItemSolicitadoEstoqueModel, Long> {
    List<ItemSolicitadoEstoqueModel> findBySolicitacao_id(Long id);
}
