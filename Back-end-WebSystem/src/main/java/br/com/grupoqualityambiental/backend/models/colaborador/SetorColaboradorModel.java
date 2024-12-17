package br.com.grupoqualityambiental.backend.models.colaborador;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "setor")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class SetorColaboradorModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
}
