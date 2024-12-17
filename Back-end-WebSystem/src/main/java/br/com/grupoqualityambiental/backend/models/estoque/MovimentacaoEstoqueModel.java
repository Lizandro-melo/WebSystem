package br.com.grupoqualityambiental.backend.models.estoque;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "movimentacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class MovimentacaoEstoqueModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long responsavel;
    private String tipo;
    @Column(name = "data_hora")
    private LocalDateTime dataHora;
    private Integer quantidade;
    @ManyToOne
    @JoinColumn(name = "item")
    private ItemEstoqueModel item;
    @ManyToOne
    @JoinColumn(name = "solicitacao")
    private SolicitacaoEstoqueModel solicitacao;
}
