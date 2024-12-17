package br.com.grupoqualityambiental.backend.models.rh;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.TipoDocRhEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name = "doc")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class DocRhModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dir;
    @Enumerated(EnumType.STRING)
    private TipoDocRhEnum tipo;
    @Column(name = "data_vencimento")
    private LocalDate dataVencimento;
    @Column(name = "data_emissao")
    private LocalDate dataEmissao;
    @Column(name = "tempo_alerta")
    private Integer tempoAlerta;
    @Column(name = "fk_auth")
    private Integer referentColaborador;
    private String apelido;
}


