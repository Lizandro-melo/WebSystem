package br.com.grupoqualityambiental.backend.models.colaborador;

import jakarta.persistence.*;
import lombok.*;


@Table(name = "empresa")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class EmpresaColaboradorModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
}
