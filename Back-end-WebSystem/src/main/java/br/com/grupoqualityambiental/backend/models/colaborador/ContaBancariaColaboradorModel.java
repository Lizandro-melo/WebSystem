package br.com.grupoqualityambiental.backend.models.colaborador;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.ContatoColaboradorEnum;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "conta_bancaria")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class ContaBancariaColaboradorModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JoinColumn(name = "fk_auth")
    @ManyToOne
    private InfoColaboradorModel colaboradorReferent;
    @Column(name = "nome_banco")
    private String nomeBanco;
    @Column(name = "n_conta")
    private String numeroConta;
    @Column(name = "n_agencia")
    private String numeroAgencia;
}
