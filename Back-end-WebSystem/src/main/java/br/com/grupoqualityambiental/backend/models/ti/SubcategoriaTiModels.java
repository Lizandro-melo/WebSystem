package br.com.grupoqualityambiental.backend.models.ti;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "subcategoria_classificacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class SubcategoriaTiModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Boolean status;
    @JoinColumn(name = "referent_categoria")
    @ManyToOne
    private CategoriaClassificacaoTiModels referentCategoria;
}

