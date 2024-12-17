package br.com.grupoqualityambiental.backend.service.rh.anotacao;

import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.rh.AnotacaoRhModels;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.rh.AnotacaoRhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class CreateAnotacaoRhService {

    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;
    @Autowired
    private AnotacaoRhRepository anotacaoRhRepository;

    public String criarAnotacao(AnotacaoRhModels anotacao) throws IntegridadeDadosException {
        if (!anotacao.getMotivo().equals("Avulsa")) {
            if (!(anotacao.getAtestado() || anotacao.getAtestadoHora() || anotacao.getFerias() || anotacao.getSuspensao() || anotacao.getLicenca() || anotacao.getAdvVerbal() || anotacao.getAdvEscrita() || anotacao.getAtraso() || anotacao.getFaltou())) {
                throw new IntegridadeDadosException("Marque uma das caixinhas de dados referente!");
            }
        }
        if (anotacao.getAtraso() && anotacao.getAtrasoTempo() <= 0) {
            throw new IntegridadeDadosException("Verifique o tempo de atraso!");
        }
        if (anotacao.getAdvEscrita() && anotacao.getAdvEscritaData() == null) {
            throw new IntegridadeDadosException("Verifique a data da adv. escrita!");
        }
        if (anotacao.getAnotacao() == null) {
            throw new IntegridadeDadosException("Escreva alguma coisa!");
        }

        anotacao.setStatus(true);
        anotacaoRhRepository.save(anotacao);
        return "Anotação criada com sucesso!";
    }
}
