package br.com.grupoqualityambiental.backend.models.notificacao;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "info_notify")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class InfoNotifyNotificacaoModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "fk_auth")
    private Integer destinatario;
    private String titulo;
    private String texto;
    private String intensao;
    private Boolean status;
    @Column(name = "show_click")
    private Boolean show;

    public InfoNotifyNotificacaoModels(Integer destinatario, String titulo, String texto) {
        this.destinatario = destinatario;
        this.titulo = titulo;
        this.texto = texto;
        this.status = true;
        this.show = false;
    }

    public InfoNotifyNotificacaoModels(Integer destinatario, String titulo, String texto, String intensao) {
        this.destinatario = destinatario;
        this.titulo = titulo;
        this.texto = texto;
        this.intensao = intensao;
        this.status = true;
        this.show = false;
    }

    public InfoNotifyNotificacaoModels(String titulo, String texto, String intensao) {
        this.titulo = titulo;
        this.texto = texto;
        this.intensao = intensao;
        this.status = true;
        this.show = false;
    }
}
