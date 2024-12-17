package br.com.grupoqualityambiental.backend.service.manutencao;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.SolicitacaoTiEnum;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.manutencao.SolicitacaoManutencaoModels;
import br.com.grupoqualityambiental.backend.models.ti.SolicitacaoTiModels;
import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.manutencao.SolicitacaoManutencaoRepository;
import br.com.grupoqualityambiental.backend.service.notificacao.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class CreateManutencaoService {

    @Autowired
    private SolicitacaoManutencaoRepository manutencaoRepository;
    @Autowired
    private AcessoRepository acessoRepository;
    @Autowired
    private NotificacaoService notificacaoService;


    public String verificarIntegridadeAndCreateSolicitacao(SolicitacaoManutencaoModels solicitacao) throws IntegridadeDadosException {
        if (solicitacao.getTitulo().isEmpty() || solicitacao.getTitulo() == null) {
            throw new IntegridadeDadosException("Título em branco!");
        } else if (solicitacao.getOcorrencia().isEmpty() || solicitacao.getOcorrencia() == null) {
            throw new IntegridadeDadosException("Ocorrência em branco");
        } else {
            solicitacao.setStatus(SolicitacaoTiEnum.PENDENTE.getRole());
            solicitacao.setDataHora(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
            manutencaoRepository.save(solicitacao);
            for (AcessoModel acesso : acessoRepository.findByRolesTI_delegado(true)) {
                notificacaoService.createNotificationColaboradorIntension("Solicitação aberta! " + solicitacao.getId(), solicitacao.getOcorrencia(), acesso.getReferentColaborador().intValue(), "suporte");
            }
            return "Manutenção solicitada!";
        }
    }

}
