package br.com.grupoqualityambiental.backend.service.notificacao;

import br.com.grupoqualityambiental.backend.models.notificacao.InfoNotifyNotificacaoModels;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.notificacao.InfoNotifyNotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificacaoService {

    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;

    @Autowired
    private InfoNotifyNotificacaoRepository infoNotifyNotificacaoRepository;

    public void createNotificationColaboradorIntension(String titulo, String texto, Integer destinatario, String intensao) {
        infoNotifyNotificacaoRepository.save(new InfoNotifyNotificacaoModels(destinatario, titulo, texto, intensao));
    }

    public void createNotificationColaborador(String titulo, String texto, Integer destinatario) {
        infoNotifyNotificacaoRepository.save(new InfoNotifyNotificacaoModels(destinatario, titulo, texto));
    }

    public void notifyGlobal(String titulo, String texto, String intensao) {
        infoNotifyNotificacaoRepository.save(new InfoNotifyNotificacaoModels(titulo, texto, intensao));
    }
}
