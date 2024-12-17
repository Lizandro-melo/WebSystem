package br.com.grupoqualityambiental.backend.service.ti;

import br.com.grupoqualityambiental.backend.models.ti.ClassificacaoTiModels;
import br.com.grupoqualityambiental.backend.models.ti.MensagemTiModels;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.ti.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UpdateTiService {


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

    public String deleteSolicitacao(Integer id){
        ClassificacaoTiModels classificacao =
                classificacaoTiRepository.findByReferentSolicitacao_id(id);
        List<MensagemTiModels> mensagens =
                mensagemTiRepository.findByReferentSolicitacao_id(id.longValue());
        if(classificacao != null){
            classificacaoTiRepository.deleteById(classificacao.getId());
        }
        if (!mensagens.isEmpty()){
            mensagemTiRepository.deleteAll(mensagens);
        }
        solicitacaoTiRepository.deleteById(id.longValue());
        return "Solicitação excluída com sucesso!";
    }
}
