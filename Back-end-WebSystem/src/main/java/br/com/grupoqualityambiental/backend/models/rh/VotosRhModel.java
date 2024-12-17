package br.com.grupoqualityambiental.backend.models.rh;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "votos")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class VotosRhModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "candidato")
    private Long candidato;
    @Column(name = "eleitor")
    private Long eleitor;
    @Column(name = "data_hora")
    private LocalDateTime dataHora;
}
