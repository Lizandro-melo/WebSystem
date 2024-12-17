package br.com.grupoqualityambiental.backend.repository.estoque;

import br.com.grupoqualityambiental.backend.models.estoque.CategoriaEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.SolicitacaoEstoqueModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoEstoqueRepository extends JpaRepository<SolicitacaoEstoqueModel, Long> {
    List<SolicitacaoEstoqueModel> findBySolicitante(Integer id);
}
