package br.com.grupoqualityambiental.backend.models.colaborador;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "alergia")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class AlergiaColaboradorModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JoinColumn(name = "fk_auth")
    @ManyToOne
    private InfoColaboradorModel colaboradorReferent;
    @Column(name = "nome")
    private String nome;
}
