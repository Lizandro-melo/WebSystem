package br.com.grupoqualityambiental.backend.models.estoque;

import br.com.grupoqualityambiental.backend.models.ti.SolicitacaoTiModels;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "item_solicitacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class ItemSolicitadoEstoqueModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer quantidade;
    @ManyToOne
    @JoinColumn(name = "solicitacao")
    private SolicitacaoEstoqueModel solicitacao;
    @ManyToOne
    @JoinColumn(name = "item")
    private ItemEstoqueModel item;

}
