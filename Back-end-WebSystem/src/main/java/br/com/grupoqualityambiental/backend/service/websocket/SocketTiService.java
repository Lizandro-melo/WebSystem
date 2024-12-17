package br.com.grupoqualityambiental.backend.service.websocket;

import br.com.grupoqualityambiental.backend.dto.ti.MensagemTiDTO;
import br.com.grupoqualityambiental.backend.dto.ti.ResponseSocketSolicitacaoTiDTO;
import br.com.grupoqualityambiental.backend.dto.ti.SolicitacaoTiDTO;
import br.com.grupoqualityambiental.backend.models.ti.MensagemTiModels;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.ti.MensagemTiRepository;
import br.com.grupoqualityambiental.backend.repository.ti.SolicitacaoTiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SocketTiService {
    @Autowired
    private SolicitacaoTiRepository solicitacaoTiRepository;
    @Autowired
    private MensagemTiRepository mensagemTiRepository;
    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;

    public ResponseSocketSolicitacaoTiDTO responseSocketSolicitacao(SolicitacaoTiDTO solicitacao) {
        List<MensagemTiDTO> mensagens = new ArrayList<>();
        for (MensagemTiModels mensagem : mensagemTiRepository.findByReferentSolicitacao_id(solicitacao.id())) {
            MensagemTiDTO mensagemFormatada = new MensagemTiDTO(mensagem, infoColaboradorRepository.findById(mensagem.getResponsavel()).get());
            mensagens.add(mensagemFormatada);
        }
        return new ResponseSocketSolicitacaoTiDTO(solicitacao, mensagens);
    }


}
