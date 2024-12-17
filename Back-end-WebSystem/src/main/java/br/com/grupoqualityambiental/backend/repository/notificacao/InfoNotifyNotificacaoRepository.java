package br.com.grupoqualityambiental.backend.repository.notificacao;

import br.com.grupoqualityambiental.backend.models.notificacao.InfoNotifyNotificacaoModels;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InfoNotifyNotificacaoRepository extends JpaRepository<InfoNotifyNotificacaoModels, Long> {
    List<InfoNotifyNotificacaoModels> findByDestinatario(Integer idColaborador);

    List<InfoNotifyNotificacaoModels> findByDestinatarioAndStatus(Integer idColaborador, boolean b);
}
