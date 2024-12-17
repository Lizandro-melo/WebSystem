package br.com.grupoqualityambiental.backend.models.rh;


import br.com.grupoqualityambiental.backend.enumerated.colaborador.TipoColaboradorEnum;
import br.com.grupoqualityambiental.backend.models.colaborador.AuthColaboradorModel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name = "anotacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class AnotacaoRhModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long responsavel;
    @Column(name = "colaborador_referent")
    private Long colaboradorReferent;
    private String anotacao;
    private Boolean atestado = false;
    private Boolean ferias = false;
    private Boolean faltou = false;
    private Boolean suspensao = false;
    private Boolean licenca = false;
    @Column(name = "atestado_hora")
    private Boolean atestadoHora = false;
    @Column(name = "adv_escrita")
    private Boolean advEscrita = false;
    @Column(name = "adv_verbal")
    private Boolean advVerbal = false;
    @Column(name = "hora_extra")
    private Float horaExtra = 0F;
    @Column(name = "data_inicio")
    private LocalDate dataInicio;
    @Column(name = "data_final")
    private LocalDate dataFinal;
    @Column(name = "adv_escrita_data")
    private LocalDate advEscritaData;
    @Column(name = "banco_positivo")
    private Float bancoPositivo = 0F;
    @Column(name = "banco_negativo")
    private Float bancoNegativo = 0F;
    @Column(name = "anotacao_tipo")
    @Enumerated(EnumType.STRING)
    private TipoColaboradorEnum tipoAnotacao;
    private String motivo;
    private Boolean atraso = false;
    @Column(name = "atraso_tempo")
    private Float atrasoTempo = 0F;
    private Boolean status = false;
    private String anexo;
}
