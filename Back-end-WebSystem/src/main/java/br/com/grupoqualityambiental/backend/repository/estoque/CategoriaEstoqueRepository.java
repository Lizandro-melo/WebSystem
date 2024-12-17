package br.com.grupoqualityambiental.backend.repository.estoque;

import br.com.grupoqualityambiental.backend.models.estoque.CategoriaEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.ItemEstoqueModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaEstoqueRepository extends JpaRepository<CategoriaEstoqueModel, Long> {
    List<CategoriaEstoqueModel> findByStatus(boolean b);
}
