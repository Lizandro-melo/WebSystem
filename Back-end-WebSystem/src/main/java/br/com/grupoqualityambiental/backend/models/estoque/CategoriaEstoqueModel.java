package br.com.grupoqualityambiental.backend.models.estoque;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "categoria")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class CategoriaEstoqueModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Boolean status;
}
