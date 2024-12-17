package br.com.grupoqualityambiental.backend.service.sistema;

import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.acesso.TiAcessoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreateSistemaService {

    @Autowired
    private TiAcessoRepository tiAcessoRepository;
    @Autowired
    private AcessoRepository acessoRepository;

    public void createRolesColaborador(Integer idcolaborador) {
        AcessoModel acessos = new AcessoModel(idcolaborador);
        acessoRepository.save(acessos);
    }

}
