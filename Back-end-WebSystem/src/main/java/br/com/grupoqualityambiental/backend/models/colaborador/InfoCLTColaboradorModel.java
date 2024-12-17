package br.com.grupoqualityambiental.backend.models.colaborador;


import br.com.grupoqualityambiental.backend.dto.auth.Register;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name = "info_clt")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InfoCLTColaboradorModel {
    @Id
    @Column(name = "fk_auth")
    private Integer id;
    @Column(name = "data_admissao")
    private LocalDate dataAdmissao;
    @Column(name = "data_demissao")
    private LocalDate dataDemissao;
    @JoinColumn(name = "fk_empresa")
    @OneToOne
    private EmpresaColaboradorModel empresa;
    @JoinColumn(name = "fk_setor")
    @OneToOne
    private SetorColaboradorModel setor;

    public InfoCLTColaboradorModel(Register register, Integer id) {
        this.id = id;
        setor = register.setor();
        empresa = register.empresa();
        dataAdmissao = register.dataAdmissao();
    }
}
