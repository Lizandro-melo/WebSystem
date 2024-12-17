package br.com.grupoqualityambiental.backend.service.rh.anotacao;

import br.com.grupoqualityambiental.backend.models.rh.AnotacaoRhModels;
import br.com.grupoqualityambiental.backend.repository.rh.AnotacaoRhRepository;
import br.com.grupoqualityambiental.backend.service.colaborador.FindColaboradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UpdateAnotacaoRhService {

    @Autowired
    private FindColaboradorService findColaboradorService;
    @Autowired
    private AnotacaoRhRepository anotacaoRhRepository;

    public String atualizarAnotacao(AnotacaoRhModels anotacao) {
        anotacaoRhRepository.save(anotacao);
        return "Anotação atualizada com sucesso!";
    }

    public String inativarNota(Integer id) {
        AnotacaoRhModels anotacao = anotacaoRhRepository.findById(id.longValue()).get();
        anotacao.setStatus(false);
        anotacaoRhRepository.save(anotacao);
        return "Anotação inativada com sucesso!";
    }

    public String reativarNota(Integer id) {
        AnotacaoRhModels anotacao = anotacaoRhRepository.findById(id.longValue()).get();
        anotacao.setStatus(true);
        anotacaoRhRepository.save(anotacao);
        return "Anotação reativada!";
    }
}
