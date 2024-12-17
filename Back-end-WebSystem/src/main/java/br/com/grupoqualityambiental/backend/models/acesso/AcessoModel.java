package br.com.grupoqualityambiental.backend.models.acesso;

import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "acesso")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class AcessoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "fk_auth")
    private Long referentColaborador;
    @JoinColumn(name = "fk_ti")
    @OneToOne
    private TiAcessoModel rolesTI;
    @JoinColumn(name = "fk_rh")
    @OneToOne
    private RhAcessoModel rolesRH;
    @JoinColumn(name = "fk_estoque")
    @OneToOne
    private EstoqueAcessoModel rolesEstoque;
    @JoinColumn(name = "fk_diversos")
    @OneToOne
    private DiversosAcessoModel rolesDiversos;

    public AcessoModel(Integer idColaborador) {
        referentColaborador = idColaborador.longValue();
    }
}