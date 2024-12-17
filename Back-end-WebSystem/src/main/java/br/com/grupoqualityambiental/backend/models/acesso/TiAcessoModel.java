package br.com.grupoqualityambiental.backend.models.acesso;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "ti")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class TiAcessoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "deletar_ticket")
    private Boolean deletarTicket;
    @Column(name = "puxar_relatorio")
    private Boolean puxarRelatorio;
    @Column(name = "reclassificar")
    private Boolean reclassificar;
    private Boolean delegado;

    public TiAcessoModel(TiAcessoModel rolesTI) {
        deletarTicket = rolesTI.getDeletarTicket();
        puxarRelatorio = rolesTI.getPuxarRelatorio();
        reclassificar = rolesTI.getReclassificar();
        delegado = rolesTI.getDelegado();
    }
}
