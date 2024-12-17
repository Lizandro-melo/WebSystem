package br.com.grupoqualityambiental.backend.models.estoque;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "solicitacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class SolicitacaoEstoqueModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long solicitante;
    private Boolean status;
    @Column(name = "data_hora")
    private LocalDateTime dataHora;
    private String prioridade;
    private String mensagem;
}
