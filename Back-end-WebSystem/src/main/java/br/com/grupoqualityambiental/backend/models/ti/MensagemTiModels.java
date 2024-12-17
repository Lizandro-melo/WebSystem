package br.com.grupoqualityambiental.backend.models.ti;

import br.com.grupoqualityambiental.backend.dto.ti.RequestMensagemTiDTO;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.MensagemTiEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Table(name = "mensagem")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class MensagemTiModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JoinColumn(name = "solicitacao")
    @ManyToOne
    private SolicitacaoTiModels referentSolicitacao;
    private String mensagem;
    @Enumerated(EnumType.STRING)
    private MensagemTiEnum status;
    @JoinColumn(name = "responsavel")
    private Long responsavel;
    @Column(name = "data_hora")
    private LocalDateTime dataHora;
    private String anexos;

    public MensagemTiModels(RequestMensagemTiDTO mensagem) {
        this.mensagem = mensagem.mensagem();
        this.responsavel = mensagem.responsavel().longValue();
        this.status = MensagemTiEnum.ENVIADO;
        this.dataHora = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        this.anexos = mensagem.anexos();
    }
}
