package br.com.grupoqualityambiental.backend.models.acesso;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "estoque")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class EstoqueAcessoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean delegado;
    @Column(name = "controle_item")
    private Boolean controleItem;
    @Column(name = "solicitacoes")
    private Boolean solicitacoes;
    @Column(name = "movimentacoes")
    private Boolean movimentacoes;
    @Column(name = "itens_alerta")
    private Boolean itensAlertas;
    @Column(name = "desativar_item")
    private Boolean desativarItem;
    @Column(name = "dar_baixa")
    private Boolean darBaixa;
}
