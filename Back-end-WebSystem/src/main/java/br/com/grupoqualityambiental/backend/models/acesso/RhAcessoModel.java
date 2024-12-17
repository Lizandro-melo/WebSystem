package br.com.grupoqualityambiental.backend.models.acesso;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "rh")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class RhAcessoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean delegado;
    @Column(name = "atualizar_dados")
    private Boolean atualizarDados;
    @Column(name = "cadastrar_colaborador")
    private Boolean cadastrarColaborador;
    @Column(name = "criar_nota")
    private Boolean criarNota;
    @Column(name = "deletar_documento")
    private Boolean deletarDocumento;
    @Column(name = "desligar_colaborador")
    private Boolean desligarColaborador;
    @Column(name = "editar_nota")
    private Boolean editarNota;
    @Column(name = "gerar_relatorio")
    private Boolean gerarRelatorio;
    @Column(name = "inativar_nota")
    private Boolean inativarNota;
    @Column(name = "acesso_doc")
    private Boolean acessoDoc;
}
