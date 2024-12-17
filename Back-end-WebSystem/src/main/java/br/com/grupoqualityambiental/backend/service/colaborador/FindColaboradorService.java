package br.com.grupoqualityambiental.backend.service.colaborador;

import br.com.grupoqualityambiental.backend.dto.colaborador.InfoColaboradorCompletoDTO;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.TipoColaboradorEnum;
import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.colaborador.*;
import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.colaborador.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
public class FindColaboradorService {
    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;
    @Autowired
    private AuthColaboradorRepository authColaboradorRepository;
    @Autowired
    private AcessoRepository acessoRepository;
    @Autowired
    private ContatoColaboradorRepository contatoColaboradorRepository;
    @Autowired
    private AlergiaColaboradorRepository alergiaColaboradorRepository;
    @Autowired
    private ContaBancariaColaboradorRepository contaBancariaColaboradorRepository;
    @Autowired
    private InfoCLTColaboradorRepository infoCLTColaboradorRepository;
    @Autowired
    private InfoEstagiarioColaboradorRepository infoEstagiarioColaboradorRepository;
    @Autowired
    private InfoMEIColaboradorRepository infoMEIColaboradorRepository;
    @Autowired
    private EmpresaColaboradorRepository empresaColaboradorRepository;
    @Autowired
    private SetorColaboradorRepository setorColaboradorRepository;

    public List<InfoColaboradorModel> getAllColaboradoresAtivos() {
        List<InfoColaboradorModel> listColaboradoresAtivos = new ArrayList<>();
        for (AuthColaboradorModel auth : authColaboradorRepository.findByStatus(true)) {
            try {
                listColaboradoresAtivos.add(infoColaboradorRepository.findById(auth.getId()).get());
            } catch (Exception e) {

            }
        }
        return listColaboradoresAtivos;
    }

    public AcessoModel GetAcessoById(Integer id) {
        return acessoRepository.findByReferentColaborador(id.longValue());
    }

    public List<InfoColaboradorModel> findByFiltro(String nome, TipoColaboradorEnum tipo) {
        List<InfoColaboradorModel> infoColaboradorModels = new ArrayList<>();
        if (Objects.equals(tipo, TipoColaboradorEnum.TODOS)) {
            return infoColaboradorRepository.findByNomeCompletoContainingIgnoreCase(nome);
        } else {
            if (Objects.equals(tipo, TipoColaboradorEnum.DESLIGADO)) {
                for (InfoColaboradorModel infoColaboradorModel : infoColaboradorRepository.findByNomeCompletoContainingIgnoreCase(nome)) {
                    if (!authColaboradorRepository.findById(infoColaboradorModel.getFkAuth()).get().getStatus()) {
                        infoColaboradorModels.add(infoColaboradorModel);
                    }
                }
            } else {
                for (InfoColaboradorModel infoColaboradorModel : infoColaboradorRepository.findByNomeCompletoContainingIgnoreCaseAndTipo(nome, tipo)) {
                    if (authColaboradorRepository.findById(infoColaboradorModel.getFkAuth()).get().getStatus()) {
                        infoColaboradorModels.add(infoColaboradorModel);
                    }
                }
            }
            return infoColaboradorModels;
        }
    }

    public InfoColaboradorCompletoDTO getAllInfoCompletasColaborador(Integer idColaborador) {
        InfoColaboradorModel infoPessoais = infoColaboradorRepository.findById(idColaborador.longValue()).get();
        AuthColaboradorModel authColaborador = authColaboradorRepository.findById(idColaborador.longValue()).get();
        List<ContatoColaboradorModel> contatos = contatoColaboradorRepository.findAllByColaboradorReferent_fkAuth(idColaborador) == null ? null : contatoColaboradorRepository.findAllByColaboradorReferent_fkAuth(idColaborador);
        List<AlergiaColaboradorModel> alergias = alergiaColaboradorRepository.findAllByColaboradorReferent_fkAuth(idColaborador) == null ? null : alergiaColaboradorRepository.findAllByColaboradorReferent_fkAuth(idColaborador);
        List<ContaBancariaColaboradorModel> contasBancarias = contaBancariaColaboradorRepository.findAllByColaboradorReferent_fkAuth(idColaborador) == null ? null : contaBancariaColaboradorRepository.findAllByColaboradorReferent_fkAuth(idColaborador);
        InfoCLTColaboradorModel infoCLT = null;
        InfoEstagiarioColaboradorModel infoEstagiario = null;
        InfoMEIColaboradorModel infoMEI = null;
        if (infoCLTColaboradorRepository.findById(idColaborador).isPresent()) {
            infoCLT = infoCLTColaboradorRepository.findById(idColaborador).get();
        }
        if (infoEstagiarioColaboradorRepository.findById(idColaborador).isPresent()) {
            infoEstagiario = infoEstagiarioColaboradorRepository.findById(idColaborador).get();
        }
        if (infoMEIColaboradorRepository.findById(idColaborador).isPresent()) {
            infoMEI = infoMEIColaboradorRepository.findById(idColaborador).get();
        }
        return new InfoColaboradorCompletoDTO(authColaborador, infoPessoais, contatos, alergias, contasBancarias, infoCLT, infoEstagiario, infoMEI);
    }

    public List<EmpresaColaboradorModel> getEmpresas() {
        return empresaColaboradorRepository.findAll();
    }

    public List<SetorColaboradorModel> getSetor() {
        return setorColaboradorRepository.findAll();
    }
}


