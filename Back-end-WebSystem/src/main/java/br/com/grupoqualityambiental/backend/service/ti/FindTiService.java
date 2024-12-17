package br.com.grupoqualityambiental.backend.service.ti;


import br.com.grupoqualityambiental.backend.dto.colaborador.InfoColaboradorCompletoDTO;
import br.com.grupoqualityambiental.backend.dto.ti.*;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.SolicitacaoTiEnum;
import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.ti.*;
import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.ti.*;
import br.com.grupoqualityambiental.backend.service.colaborador.FindColaboradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FindTiService {

    @Autowired
    private SolicitacaoTiRepository solicitacaoTiRepository;
    @Autowired
    private MensagemTiRepository mensagemTiRepository;
    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;
    @Autowired
    private GrupoClassificacaoTiRepository grupoClassificacaoTiRepository;
    @Autowired
    private CategoriaClassificacaoTiRepository categoriaClassificacaoTiRepository;
    @Autowired
    private SubcaregoriaTiRepository subcaregoriaTiRepository;
    @Autowired
    private ClassificacaoTiRepository classificacaoTiRepository;
    @Autowired
    private FindColaboradorService findColaboradorService;
    @Autowired
    private AcessoRepository acessoRepository;

    public List<SolicitacaoTiDTO> getSolicitacoes() {
        List<SolicitacaoTiDTO> solicitacoesTiDTO = new ArrayList<>();
        for (SolicitacaoTiModels solicitacao :
                solicitacaoTiRepository.findAll()) {
            if (solicitacao.getStatus() == SolicitacaoTiEnum.FINALIZADO) {
                continue;
            }
            InfoColaboradorCompletoDTO solicitante = findColaboradorService.getAllInfoCompletasColaborador(solicitacao.getSolicitante().intValue());
            solicitacoesTiDTO.add(new SolicitacaoTiDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), solicitacao.getDataHoraFinalizado()));
        }
        return solicitacoesTiDTO;
    }

    public List<SolicitacaoTiDTO> getSolicitacoesby(Integer id) {
        List<SolicitacaoTiDTO> solicitacoesTiDTO = new ArrayList<>();
        for (SolicitacaoTiModels solicitacao :
                solicitacaoTiRepository.findBySolicitante(id)) {
            if (solicitacao.getStatus() == SolicitacaoTiEnum.FINALIZADO) {
                continue;
            }
            InfoColaboradorCompletoDTO solicitante = findColaboradorService.getAllInfoCompletasColaborador(solicitacao.getSolicitante().intValue());
            solicitacoesTiDTO.add(new SolicitacaoTiDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), solicitacao.getDataHoraFinalizado()));
        }
        return solicitacoesTiDTO;
    }

    public List<SolicitacaoTiWithMotivoDTO> getSolicitacoesAll(FiltroSolicitacaoFindDTO filtro) {
        List<SolicitacaoTiWithMotivoDTO> solicitacoesTiDTO = new ArrayList<>();
        LocalDateTime dataTimeInicio = filtro.dataInicio().atTime(10, 30);
        LocalDateTime dataTimeFinal = filtro.dataFinal().atTime(10, 30);
        AcessoModel acesso = acessoRepository.findByReferentColaborador(filtro.solicitante());
        try {
            if (acesso.getRolesTI().getDelegado()) {
                if (filtro.idSolicitacao() == null) {
                    for (SolicitacaoTiModels solicitacao :
                            solicitacaoTiRepository.findByDataHoraBetween(dataTimeInicio, dataTimeFinal)) {
                        InfoColaboradorModel solicitante = infoColaboradorRepository.findById(solicitacao.getSolicitante()).get();
                        ClassificacaoTiModels classsificacao = classificacaoTiRepository.findByReferentSolicitacao_id(solicitacao.getId().intValue());
                        if (classsificacao != null) {
                            solicitacoesTiDTO.add(new SolicitacaoTiWithMotivoDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), classsificacao.getReferentCategoria().getNome(), solicitacao.getDataHoraFinalizado()));
                        } else {
                            solicitacoesTiDTO.add(new SolicitacaoTiWithMotivoDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), null, solicitacao.getDataHoraFinalizado()));
                        }
                    }
                } else {
                    SolicitacaoTiModels solicitacao = solicitacaoTiRepository.findById(filtro.idSolicitacao().longValue()).get();
                    InfoColaboradorModel solicitante = infoColaboradorRepository.findById(solicitacao.getSolicitante()).get();
                    ClassificacaoTiModels classsificacao = classificacaoTiRepository.findByReferentSolicitacao_id(solicitacao.getId().intValue());
                    if (classsificacao != null) {
                        solicitacoesTiDTO.add(new SolicitacaoTiWithMotivoDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), classsificacao.getReferentCategoria().getNome(), solicitacao.getDataHoraFinalizado()));
                    } else {
                        solicitacoesTiDTO.add(new SolicitacaoTiWithMotivoDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), null, solicitacao.getDataHoraFinalizado()));
                    }
                }
            }
        }catch (Exception e){
            if (filtro.idSolicitacao() == null) {
                for (SolicitacaoTiModels solicitacao :
                        solicitacaoTiRepository.findBySolicitanteAndDataHoraBetween(filtro.solicitante(), dataTimeInicio, dataTimeFinal)) {
                    InfoColaboradorModel solicitante = infoColaboradorRepository.findById(solicitacao.getSolicitante()).get();
                    ClassificacaoTiModels classsificacao = classificacaoTiRepository.findByReferentSolicitacao_id(solicitacao.getId().intValue());
                    if (classsificacao != null) {
                        solicitacoesTiDTO.add(new SolicitacaoTiWithMotivoDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), classsificacao.getReferentCategoria().getNome(), solicitacao.getDataHoraFinalizado()));
                    } else {
                        solicitacoesTiDTO.add(new SolicitacaoTiWithMotivoDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), null, solicitacao.getDataHoraFinalizado()));
                    }
                }
            } else {
                SolicitacaoTiModels solicitacao = solicitacaoTiRepository.findByIdAndSolicitante(filtro.idSolicitacao().longValue(), filtro.solicitante());
                InfoColaboradorModel solicitante = infoColaboradorRepository.findById(solicitacao.getSolicitante()).get();
                ClassificacaoTiModels classsificacao = classificacaoTiRepository.findByReferentSolicitacao_id(solicitacao.getId().intValue());
                if (classsificacao != null) {
                    solicitacoesTiDTO.add(new SolicitacaoTiWithMotivoDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), classsificacao.getReferentCategoria().getNome(), solicitacao.getDataHoraFinalizado()));
                } else {
                    solicitacoesTiDTO.add(new SolicitacaoTiWithMotivoDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), null, solicitacao.getDataHoraFinalizado()));
                }
            }
        }
        return solicitacoesTiDTO;
    }

    public List<MensagemTiDTO> getAllMensagens(Integer idSolicitacao) {
        List<MensagemTiDTO> mensagens = new ArrayList<>();
        for (MensagemTiModels mensagem : mensagemTiRepository.findByReferentSolicitacao_id(idSolicitacao.longValue())) {
            MensagemTiDTO mensagemFormatada = new MensagemTiDTO(mensagem, infoColaboradorRepository.findById(mensagem.getResponsavel()).get());
            mensagens.add(mensagemFormatada);
        }
        return mensagens;
    }

    public ResponseSocketSolicitacaoTiDTO responseSocketSolicitacao(SolicitacaoTiDTO solicitacao) {
        List<MensagemTiDTO> mensagens = new ArrayList<>();
        for (MensagemTiModels mensagem : mensagemTiRepository.findByReferentSolicitacao_id(solicitacao.id())) {
            MensagemTiDTO mensagemFormatada = new MensagemTiDTO(mensagem, infoColaboradorRepository.findById(mensagem.getResponsavel()).get());
            mensagens.add(mensagemFormatada);
        }
        return new ResponseSocketSolicitacaoTiDTO(solicitacao, mensagens);
    }

    public SolicitacaoTiDTO getSolicitacao(Integer idSolicitacao) {
        SolicitacaoTiModels solicitacao = solicitacaoTiRepository.findById(idSolicitacao.longValue()).get();
        InfoColaboradorCompletoDTO solicitante = findColaboradorService.getAllInfoCompletasColaborador(solicitacao.getSolicitante().intValue());
        return new SolicitacaoTiDTO(solicitacao.getId(), solicitante, solicitacao.getDataHora(), solicitacao.getTitulo(), solicitacao.getOcorrencia(), solicitacao.getStatus(), solicitacao.getAnexos(), solicitacao.getDataHoraFinalizado());
    }

    public List<GrupoClassificacaoTiModels> findGrupoClassificacao(boolean b) {
        return grupoClassificacaoTiRepository.findAllByStatus(b);
    }

    public List<CategoriaClassificacaoTiModels> findCategoriaClassificacao(Integer idGrupo, boolean b) {
        return categoriaClassificacaoTiRepository.findByReferentGrupo_idAndStatus(idGrupo, b);
    }


    public List<CategoriaClassificacaoTiModels> findCategoriaAll() {
        return categoriaClassificacaoTiRepository.findAll();
    }

    public List<SubcategoriaTiModels> findSubCategoriaClassificacao(Integer idCategoria, boolean b) {
        return subcaregoriaTiRepository.findByReferentCategoria_idAndStatus(idCategoria, b);
    }
}
