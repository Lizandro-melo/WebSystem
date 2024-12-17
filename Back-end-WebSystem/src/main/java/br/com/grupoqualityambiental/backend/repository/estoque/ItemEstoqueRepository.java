package br.com.grupoqualityambiental.backend.repository.estoque;

import br.com.grupoqualityambiental.backend.models.estoque.ItemEstoqueModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemEstoqueRepository extends JpaRepository<ItemEstoqueModel, Long> {
    List<ItemEstoqueModel> findByNomeContainingIgnoreCase(String nome);

    List<ItemEstoqueModel> findByNomeContainingIgnoreCaseAndCategoria_nomeContainingIgnoreCase(String nome, String nomeCategoria);
}
