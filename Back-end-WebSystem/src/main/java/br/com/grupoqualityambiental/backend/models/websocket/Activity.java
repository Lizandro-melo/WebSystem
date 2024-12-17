package br.com.grupoqualityambiental.backend.models.websocket;

import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Activity {
    private InfoColaboradorModel user;
    private Boolean type;
    private LocalDateTime date = LocalDateTime.now();

    public Activity(InfoColaboradorModel user, Boolean type) {
        this.user = user;
        this.type = type;
    }
}
