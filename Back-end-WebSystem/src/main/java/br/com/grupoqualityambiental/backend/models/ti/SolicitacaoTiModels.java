package br.com.grupoqualityambiental.backend.models.ti;


import br.com.grupoqualityambiental.backend.enumerated.colaborador.SolicitacaoTiEnum;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
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
public class SolicitacaoTiModels {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long solicitante;
    @Column(name = "data_hora")
    private LocalDateTime dataHora;
    private String titulo;
    private String ocorrencia;
    @Enumerated(EnumType.STRING)
    private SolicitacaoTiEnum status;
    private String anexos;
    @Column(name = "data_hora_finalizado")
    private LocalDateTime dataHoraFinalizado;


}
