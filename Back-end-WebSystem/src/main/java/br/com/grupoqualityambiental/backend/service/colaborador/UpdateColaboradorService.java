package br.com.grupoqualityambiental.backend.service.colaborador;

import br.com.grupoqualityambiental.backend.dto.colaborador.InfoColaboradorCompletoDTO;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.TipoColaboradorEnum;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.colaborador.*;
import br.com.grupoqualityambiental.backend.models.rh.ConfigMatriculaRhModels;
import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.colaborador.*;
import br.com.grupoqualityambiental.backend.repository.rh.ConfigMatriculaRhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class UpdateColaboradorService {
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
    @Autowired
    private ConfigMatriculaRhRepository configMatriculaRhRepository;

    @Transactional
    public String atualizarDados(InfoColaboradorCompletoDTO infomacoes) {
        infomacoes.infoPessoais().setNomeCompleto(infomacoes.infoPessoais().getNomeCompleto().toUpperCase());
        if (infomacoes.infoPessoais().getCpf() != null) {
            String chares = ".- ";
            for (String c : chares.split("")) {
                infomacoes.infoPessoais().setCpf(infomacoes.infoPessoais().getCpf().replace(c, ""));
            }
        }
        infomacoes.infoPessoais().setEmailCorporativo(infomacoes.infoPessoais().getEmailCorporativo().toLowerCase());
        infoColaboradorRepository.save(infomacoes.infoPessoais());
        contatoColaboradorRepository.deleteByColaboradorReferent_fkAuth(infomacoes.infoPessoais().getFkAuth());
        alergiaColaboradorRepository.deleteByColaboradorReferent_fkAuth(infomacoes.infoPessoais().getFkAuth());
        contaBancariaColaboradorRepository.deleteByColaboradorReferent_fkAuth(infomacoes.infoPessoais().getFkAuth());
        if (!(infomacoes.contatos() == null || infomacoes.contatos().isEmpty())) {
            contatoColaboradorRepository.saveAll(infomacoes.contatos());
        }
        if (!(infomacoes.alergias() == null || infomacoes.alergias().isEmpty())) {
            alergiaColaboradorRepository.saveAll(infomacoes.alergias());
        }
        if (!(infomacoes.contasBancarias() == null || infomacoes.contasBancarias().isEmpty())) {
            contaBancariaColaboradorRepository.saveAll(infomacoes.contasBancarias());
        }
        if (infomacoes.infoCLT() != null) {
            infoCLTColaboradorRepository.save(infomacoes.infoCLT());
        }
        if (infomacoes.infoEstagiario() != null) {
            infoEstagiarioColaboradorRepository.save(infomacoes.infoEstagiario());
        }
        if (infomacoes.infoMEI() != null) {
            infoMEIColaboradorRepository.save(infomacoes.infoMEI());
        }
        return "Colaborador atualizado com sucesso!";
    }

    public String promoverEstagiario(Integer id, LocalDate dataInicio) throws IntegridadeDadosException {
        InfoColaboradorModel infoColaborador = infoColaboradorRepository.findById(id.longValue()).get();
        AuthColaboradorModel authColaboradorModel = authColaboradorRepository.findById(id.longValue()).get();
        ConfigMatriculaRhModels configMatriculaRhModels = configMatriculaRhRepository.findAll().get(0);
        if (infoColaborador.getTipo() == TipoColaboradorEnum.CLT) {
            throw new IntegridadeDadosException("Não é possivel executar este comando!");
        }
        InfoEstagiarioColaboradorModel infoEstagiarioColaborador = infoEstagiarioColaboradorRepository.findById(id).get();
        InfoCLTColaboradorModel infoCLTColaboradorModel = new InfoCLTColaboradorModel();
        infoColaborador.setTipo(TipoColaboradorEnum.CLT);
        infoColaborador.setIdentificacao("Funcionario." + configMatriculaRhModels.getQuantidadeClt() + 1);
        configMatriculaRhModels.setQuantidadeClt(configMatriculaRhModels.getQuantidadeClt() + 1);
        infoEstagiarioColaborador.setStatus(false);
        infoEstagiarioColaborador.setDataDemissao(dataInicio);
        infoCLTColaboradorModel.setId(id);
        infoCLTColaboradorModel.setEmpresa(infoEstagiarioColaborador.getEmpresa());
        infoCLTColaboradorModel.setSetor(infoEstagiarioColaborador.getSetor());
        infoCLTColaboradorModel.setDataAdmissao(dataInicio);
        infoColaboradorRepository.save(infoColaborador);
        infoEstagiarioColaboradorRepository.save(infoEstagiarioColaborador);
        infoCLTColaboradorRepository.save(infoCLTColaboradorModel);
        authColaboradorRepository.save(authColaboradorModel);
        configMatriculaRhRepository.save(configMatriculaRhModels);
        return "Estagiario contratado!";
    }

    public String desligarColaborador(Integer id, LocalDate dataInicio) throws IntegridadeDadosException {
        InfoColaboradorModel infoColaborador = infoColaboradorRepository.findById(id.longValue()).get();
        switch (infoColaborador.getTipo()) {
            case CLT:
                InfoCLTColaboradorModel infoCLTColaborador = infoCLTColaboradorRepository.findById(id).get();
                infoCLTColaborador.setDataDemissao(dataInicio);
                infoCLTColaboradorRepository.save(infoCLTColaborador);
                break;

            case ESTAGIARIO:
                InfoEstagiarioColaboradorModel infoEstagiarioColaborador = infoEstagiarioColaboradorRepository.findById(id).get();
                infoEstagiarioColaborador.setDataDemissao(dataInicio);
                infoEstagiarioColaboradorRepository.save(infoEstagiarioColaborador);
                break;
            case TERCEIRIZADO:
                InfoMEIColaboradorModel infoMEIColaboradorModel = infoMEIColaboradorRepository.findById(id).get();
                infoMEIColaboradorModel.setDataDemissao(dataInicio);
                infoMEIColaboradorRepository.save(infoMEIColaboradorModel);
                break;
        }
        AuthColaboradorModel userAuth = authColaboradorRepository.findById(id.longValue()).get();
        userAuth.setStatus(false);
        infoColaboradorRepository.save(infoColaborador);
        authColaboradorRepository.save(userAuth);
        return "Colaborador desligado!";
    }

    public String reativarColaborador(Integer id, LocalDate dataInicio) throws IntegridadeDadosException {
        InfoColaboradorModel infoColaborador = infoColaboradorRepository.findById(id.longValue()).get();
        switch (infoColaborador.getTipo()) {
            case CLT:
                InfoCLTColaboradorModel infoCLTColaborador = infoCLTColaboradorRepository.findById(id).get();
                infoCLTColaborador.setDataAdmissao(dataInicio);
                infoCLTColaborador.setDataDemissao(null);
                infoCLTColaboradorRepository.save(infoCLTColaborador);
                break;
            case ESTAGIARIO:
                InfoEstagiarioColaboradorModel infoEstagiarioColaborador = infoEstagiarioColaboradorRepository.findById(id).get();
                infoEstagiarioColaborador.setDataAdmissao(dataInicio);
                infoEstagiarioColaborador.setDataDemissao(null);
                infoEstagiarioColaborador.setStatus(true);
                infoEstagiarioColaboradorRepository.save(infoEstagiarioColaborador);
                break;
            case TERCEIRIZADO:
                InfoMEIColaboradorModel infoMEIColaboradorModel = infoMEIColaboradorRepository.findById(id).get();
                infoMEIColaboradorModel.setDataAdmissao(dataInicio);
                infoMEIColaboradorModel.setDataDemissao(null);
                infoMEIColaboradorRepository.save(infoMEIColaboradorModel);
                break;
        }
        AuthColaboradorModel userAuth = authColaboradorRepository.findById(id.longValue()).get();
        userAuth.setStatus(true);
        infoColaboradorRepository.save(infoColaborador);
        authColaboradorRepository.save(userAuth);
        return "Colaborador desligado!";
    }

}
