package br.com.grupoqualityambiental.backend.models.colaborador;


import br.com.grupoqualityambiental.backend.dto.auth.Register;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.ContatoColaboradorEnum;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "contato")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class ContatoColaboradorModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JoinColumn(name = "fk_auth")
    @ManyToOne
    private InfoColaboradorModel colaboradorReferent;
    @Enumerated(EnumType.STRING)
    private ContatoColaboradorEnum tipo;
    @Column(name = "numero_celular")
    private String nuCelular;
    @Column(name = "numero_fixo")
    private String nuFixo;
    private String email;
    private String nome;

    public ContatoColaboradorModel(Register register, InfoColaboradorModel infoColaborador) {
        colaboradorReferent = infoColaborador;
        tipo = ContatoColaboradorEnum.PESSOAL;
        nuCelular = register.nCelular();
        email = register.email();
        nome = "Proprio";
    }

}
