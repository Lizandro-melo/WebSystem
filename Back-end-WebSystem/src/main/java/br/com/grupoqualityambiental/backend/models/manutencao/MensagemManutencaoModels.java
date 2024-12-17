package br.com.grupoqualityambiental.backend.models.manutencao;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "mensagem")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class MensagemManutencaoModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String mensagem;
    private String status;
    @Column(name = "data_hora")
    private LocalDateTime dataHora;
    private String anexos;
    @ManyToOne
    @JoinColumn(name = "solicitacao")
    private SolicitacaoManutencaoModels solicitacaoReferent;
    @Column(name = "fk_auth")
    private Integer colaboradorReferent;
}
