package br.com.grupoqualityambiental.backend.models.ti;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "grupo_classificacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class GrupoClassificacaoTiModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Boolean status;
}
