package br.com.grupoqualityambiental.backend.models.websocket;

import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Content {
    private List<Activity> activity = new ArrayList<>();
    private List<InfoColaboradorModel> users = new ArrayList<>();
    private String content;
}
