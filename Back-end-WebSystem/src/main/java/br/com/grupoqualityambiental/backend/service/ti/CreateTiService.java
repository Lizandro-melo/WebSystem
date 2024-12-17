package br.com.grupoqualityambiental.backend.service.ti;

import br.com.grupoqualityambiental.backend.dto.ti.RequestClassificarDTO;
import br.com.grupoqualityambiental.backend.dto.ti.RequestMensagemTiDTO;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.SolicitacaoTiEnum;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.ti.ClassificacaoTiModels;
import br.com.grupoqualityambiental.backend.models.ti.MensagemTiModels;
import br.com.grupoqualityambiental.backend.models.ti.SolicitacaoTiModels;
import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.ti.*;
import br.com.grupoqualityambiental.backend.service.notificacao.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class CreateTiService {

    @Autowired
    private SolicitacaoTiRepository solicitacaoTiRepository;
    @Autowired
    private MensagemTiRepository mensagemTiRepository;
    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;
    @Autowired
    private ClassificacaoTiRepository classificacaoTiRepository;
    @Autowired
    private GrupoClassificacaoTiRepository grupoClassificacaoTiRepository;
    @Autowired
    private CategoriaClassificacaoTiRepository categoriaClassificacaoTiRepository;
    @Autowired
    private SubcaregoriaTiRepository subcaregoriaTiRepository;
    @Autowired
    private AcessoRepository acessoRepository;
    @Autowired
    private NotificacaoService notificacaoService;

    public String verificarIntegridadeAndCreateSolicitacao(SolicitacaoTiModels solicitacao) throws IntegridadeDadosException {
        if (solicitacao.getTitulo().isEmpty() || solicitacao.getTitulo() == null) {
            throw new IntegridadeDadosException("Título em branco!");
        } else if (solicitacao.getOcorrencia().isEmpty() || solicitacao.getOcorrencia() == null) {
            throw new IntegridadeDadosException("Ocorrência em branco");
        } else if (solicitacao.getSolicitante() == null) {
            throw new IntegridadeDadosException("Ocorreu algum erro no processo de solicitação, contate ao setor de TI");
        } else {
            solicitacao.setStatus(SolicitacaoTiEnum.PENDENTE);
            solicitacao.setDataHora(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
            solicitacaoTiRepository.save(solicitacao);
            for (AcessoModel acesso : acessoRepository.findByRolesTI_delegado(true)) {
                notificacaoService.createNotificationColaboradorIntension("Solicitação aberta! " + solicitacao.getId(), solicitacao.getOcorrencia(), acesso.getReferentColaborador().intValue(), "suporte");
            }
            return "Solicitação feita com sucesso!";
        }
    }

    public String verficarIntegridadeAndSendMensagem(RequestMensagemTiDTO mensagem) throws IntegridadeDadosException {
        if (mensagem.mensagem().isEmpty() || mensagem.mensagem() == null) {
            throw new IntegridadeDadosException("Mensagem em branco!");
        } else if (mensagem.responsavel() == null || mensagem.referentSolicitacao() == null || !solicitacaoTiRepository.existsById(mensagem.referentSolicitacao().longValue())) {
            throw new IntegridadeDadosException("Ocorreu algum erro no processo de solicitação, contate ao setor de TI");
        } else {
            MensagemTiModels mensagemTiModels = new MensagemTiModels(mensagem);
            SolicitacaoTiModels solicitacao = solicitacaoTiRepository.findById(mensagem.referentSolicitacao().longValue()).get();
            mensagemTiModels.setReferentSolicitacao(solicitacao);
            solicitacao.setStatus(SolicitacaoTiEnum.PENDENTE);
            mensagemTiRepository.save(mensagemTiModels);
            solicitacaoTiRepository.save(solicitacao);
            if (solicitacao.getSolicitante() == mensagem.responsavel().longValue()) {
                for (AcessoModel acesso : acessoRepository.findByRolesTI_delegado(true)) {
                    notificacaoService.createNotificationColaboradorIntension("Mensagem da solicitação: " + solicitacao.getId(), mensagem.mensagem(), acesso.getReferentColaborador().intValue(), "suporte");
                }
            } else {
                notificacaoService.createNotificationColaboradorIntension("Sua solicitação " + solicitacao.getId() + " foi respondida", mensagem.mensagem(), solicitacao.getSolicitante().intValue(), "suporte");
            }

            return "Mensagem enviada com sucesso!";
//            return new MensagemTiDTO(mensagemTiModels, infoColaboradorRepository.findById(mensagem.responsavel().longValue()).get());
        }
    }

    public void verificarIntegridadeAndClassificarTicket(RequestClassificarDTO classificacao) {
        ClassificacaoTiModels classificacaoTiModel =
                new ClassificacaoTiModels();

        if (classificacao.referentGrupo() != null) {
            classificacaoTiModel.setReferentGrupo(grupoClassificacaoTiRepository.findById(classificacao.referentGrupo().longValue()).get());
        }
        if (classificacao.referentCategoria() != null) {
            classificacaoTiModel.setReferentCategoria(categoriaClassificacaoTiRepository.findById(classificacao.referentCategoria().longValue()).get());
        }
        if (classificacao.referentSubcategoria() != null) {
            classificacaoTiModel.setReferentSubcategoria(subcaregoriaTiRepository.findById(classificacao.referentSubcategoria().longValue()).get());
        }
        SolicitacaoTiModels solicitacao =
                solicitacaoTiRepository.findById(classificacao.referentSolicitacao().longValue()).get();
        classificacaoTiModel.setReferentSolicitacao(solicitacao);
        solicitacao.setStatus(SolicitacaoTiEnum.FINALIZADO);
        solicitacao.setDataHoraFinalizado(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        if (!classificacao.observacao().isEmpty()) {
            classificacaoTiModel.setObservacao(classificacao.observacao());
        }
        classificacaoTiModel.setResponsavel(classificacao.responsavel().longValue());
        classificacaoTiModel.setDataHora(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));

        classificacaoTiRepository.save(classificacaoTiModel);
        solicitacaoTiRepository.save(solicitacao);
        notificacaoService.createNotificationColaboradorIntension("Solicitação " + solicitacao.getId() + " finalizada!", "Sua Solicitação foi finalizada, você pode verificar no historico a conclusão da mesma!", solicitacao.getSolicitante().intValue(), "suporte");
    }

    public void verificarIntegridadeAndReClassificarTicket(RequestClassificarDTO classificacao) {
        ClassificacaoTiModels classificacaoTiModel =
                new ClassificacaoTiModels();

        if (classificacao.referentGrupo() != null) {
            classificacaoTiModel.setReferentGrupo(grupoClassificacaoTiRepository.findById(classificacao.referentGrupo().longValue()).get());
        }
        if (classificacao.referentCategoria() != null) {
            classificacaoTiModel.setReferentCategoria(categoriaClassificacaoTiRepository.findById(classificacao.referentCategoria().longValue()).get());
        }
        if (classificacao.referentSubcategoria() != null) {
            classificacaoTiModel.setReferentSubcategoria(subcaregoriaTiRepository.findById(classificacao.referentSubcategoria().longValue()).get());
        }
        SolicitacaoTiModels solicitacao =
                solicitacaoTiRepository.findById(classificacao.referentSolicitacao().longValue()).get();
        ClassificacaoTiModels classificacaoExistente = classificacaoTiRepository.findByReferentSolicitacao_id(classificacao.referentSolicitacao());
        if (classificacaoExistente != null) {
            classificacaoTiRepository.delete(classificacaoExistente);
        }
        classificacaoTiModel.setReferentSolicitacao(solicitacao);
        solicitacao.setStatus(SolicitacaoTiEnum.FINALIZADO);
        solicitacao.setDataHoraFinalizado(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        if (!classificacao.observacao().isEmpty()) {
            classificacaoTiModel.setObservacao(classificacao.observacao());
        }
        classificacaoTiModel.setResponsavel(classificacao.responsavel().longValue());
        classificacaoTiModel.setDataHora(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));

        classificacaoTiRepository.save(classificacaoTiModel);
        solicitacaoTiRepository.save(solicitacao);
        notificacaoService.createNotificationColaboradorIntension("Solicitação " + solicitacao.getId() + " finalizada!", "Sua Solicitação foi finalizada, você pode verificar no historico a conclusão da mesma!", solicitacao.getSolicitante().intValue(), "suporte");

    }
}
