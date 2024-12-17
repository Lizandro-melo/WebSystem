package br.com.grupoqualityambiental.backend.models.acesso;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "diversos")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class DiversosAcessoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "bot_logistica")
    private Boolean botLogistica;
    @Column(name = "telefonia")
    private Boolean telefonia;
    @Column(name = "troca_ramal_telefonia")
    private Boolean trocaRamal;
}
