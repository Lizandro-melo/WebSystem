package br.com.grupoqualityambiental.backend.models.ti;

import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Table(name = "classificacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class ClassificacaoTiModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JoinColumn(name = "fk_grupo")
    @ManyToOne
    private GrupoClassificacaoTiModels referentGrupo;
    @JoinColumn(name = "fk_categoria")
    @ManyToOne
    private CategoriaClassificacaoTiModels referentCategoria;
    @JoinColumn(name = "fk_subcategoria")
    @ManyToOne
    private SubcategoriaTiModels referentSubcategoria;
    @JoinColumn(name = "fk_solicitacao")
    @ManyToOne
    private SolicitacaoTiModels referentSolicitacao;
    private Long responsavel;
    @Column(name = "data_hora")
    private LocalDateTime dataHora;
    private String observacao;
}
