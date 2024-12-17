package br.com.grupoqualityambiental.backend.service.notificacao;

import br.com.grupoqualityambiental.backend.models.notificacao.InfoNotifyNotificacaoModels;
import br.com.grupoqualityambiental.backend.repository.notificacao.InfoNotifyNotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FindNotificacaoService {

    @Autowired
    private InfoNotifyNotificacaoRepository infoNotifyNotificacaoRepository;

    public List<InfoNotifyNotificacaoModels> findAllColaboradorNotify(Integer idColaborador) {
        return infoNotifyNotificacaoRepository.findByDestinatarioAndStatus(idColaborador, true);
    }

    public List<InfoNotifyNotificacaoModels> findAllGlobalNotify() {
        return infoNotifyNotificacaoRepository.findByDestinatarioAndStatus(null, true);
    }

}
