package br.com.grupoqualityambiental.backend.repository.estoque;

import br.com.grupoqualityambiental.backend.models.estoque.CategoriaEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.MovimentacaoEstoqueModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoqueModel, Long> {
    List<MovimentacaoEstoqueModel> findBySolicitacao_id(long l);
}
