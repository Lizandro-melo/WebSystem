package br.com.grupoqualityambiental.backend.models.rh;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "candidatos")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class CandidatosRhModel {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;
    @Column(name = "fk_auth")
    private Integer candidato;
}
