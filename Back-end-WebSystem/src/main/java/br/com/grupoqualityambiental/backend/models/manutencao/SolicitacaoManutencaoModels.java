package br.com.grupoqualityambiental.backend.models.manutencao;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Table(name = "solicitacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class SolicitacaoManutencaoModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "responsaveis", nullable = false)
    private String responsaveis;
    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;
    @Column(name = "data_hora_finalizado", nullable = false)
    private LocalDateTime dataHoraFinalizado;
    private String titulo;
    private String ocorrencia;
    private String status;
    private String anexos;
    private String tipo;
}
