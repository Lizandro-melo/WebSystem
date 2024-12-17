package br.com.grupoqualityambiental.backend.service.notificacao;

import br.com.grupoqualityambiental.backend.models.notificacao.InfoNotifyNotificacaoModels;
import br.com.grupoqualityambiental.backend.repository.notificacao.InfoNotifyNotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UpdateNotificacaoService {

    @Autowired
    private InfoNotifyNotificacaoRepository infoNotifyNotificacaoRepository;

    public void notifyVisualizada(Integer idNotify) {
        InfoNotifyNotificacaoModels notifyReferent = infoNotifyNotificacaoRepository.findById(idNotify.longValue()).get();
        notifyReferent.setShow(true);
        infoNotifyNotificacaoRepository.save(notifyReferent);
    }

    public void notifyDesativar(Integer idNotify) {
        InfoNotifyNotificacaoModels notifyReferent = infoNotifyNotificacaoRepository.findById(idNotify.longValue()).get();
        notifyReferent.setStatus(false);
        infoNotifyNotificacaoRepository.save(notifyReferent);
    }

    public void notifyDesativarAll(Integer idUser) {
        for (InfoNotifyNotificacaoModels notifyReferent : infoNotifyNotificacaoRepository.findByDestinatario(idUser)) {
            notifyReferent.setStatus(false);
            infoNotifyNotificacaoRepository.save(notifyReferent);
        }
    }

}
