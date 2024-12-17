package br.com.grupoqualityambiental.backend.models.rh;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "config_matricula")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class ConfigMatriculaRhModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "quantidade_clt")
    private int quantidadeClt;
    @Column(name = "quantidade_estagiario")
    private int quantidadeEstagiario;
    @Column(name = "quantidade_mei")
    private int quantidadeMei;
}
