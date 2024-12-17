package br.com.grupoqualityambiental.backend.controller.notificacao;

import br.com.grupoqualityambiental.backend.models.notificacao.InfoNotifyNotificacaoModels;
import br.com.grupoqualityambiental.backend.service.notificacao.FindNotificacaoService;
import br.com.grupoqualityambiental.backend.service.notificacao.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "notify/find")
public class FindNotificacaoController {

    @Autowired
    private FindNotificacaoService findNotificacaoService;
    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping(path = "my")
    public List<InfoNotifyNotificacaoModels> findNotificacao(@RequestParam("id") Integer id) {
        return findNotificacaoService.findAllColaboradorNotify(id);
    }
}
