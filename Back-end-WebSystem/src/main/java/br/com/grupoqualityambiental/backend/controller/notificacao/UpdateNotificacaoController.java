package br.com.grupoqualityambiental.backend.controller.notificacao;

import br.com.grupoqualityambiental.backend.models.notificacao.InfoNotifyNotificacaoModels;
import br.com.grupoqualityambiental.backend.service.notificacao.FindNotificacaoService;
import br.com.grupoqualityambiental.backend.service.notificacao.NotificacaoService;
import br.com.grupoqualityambiental.backend.service.notificacao.UpdateNotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "notify/update")
public class UpdateNotificacaoController {

    @Autowired
    private UpdateNotificacaoService updateNotificacaoService;
    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping(path = "active")
    public void findNotificacao(@RequestParam("id") Integer id) {
        updateNotificacaoService.notifyVisualizada(id);
    }

    @GetMapping(path = "/desative")
    public void desativarNotificacao(@RequestParam("id") Integer id) {
        updateNotificacaoService.notifyDesativar(id);
    }

    @GetMapping(path = "/limpar")
    public void limparTudo(@RequestParam("id") Integer id) {
        updateNotificacaoService.notifyDesativarAll(id);
    }
}
