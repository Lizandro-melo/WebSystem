package br.com.grupoqualityambiental.backend.models.rh;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "config_votacao")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class ConfigVotacaoRhModel {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;
    @Column(name = "data_hora_ini")
    private LocalDateTime dataHoraIni;
    @Column(name = "data_hora_final")
    private LocalDateTime dataHoraFinal;
}
