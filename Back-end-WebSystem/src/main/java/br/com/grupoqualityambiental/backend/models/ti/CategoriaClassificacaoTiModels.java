package br.com.grupoqualityambiental.backend.models.ti;

import jakarta.persistence.*;
import lombok.*;
@Table(name = "categoria_classificacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class CategoriaClassificacaoTiModels {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Boolean status;
    @JoinColumn(name = "referent_grupo")
    @ManyToOne
    private GrupoClassificacaoTiModels referentGrupo;
}
