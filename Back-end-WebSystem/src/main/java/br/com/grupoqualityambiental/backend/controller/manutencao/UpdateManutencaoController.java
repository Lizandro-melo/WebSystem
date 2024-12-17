package br.com.grupoqualityambiental.backend.controller.manutencao;

import br.com.grupoqualityambiental.backend.service.manutencao.UpdateManutencaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
        path = "manutencao/update"
)
public class UpdateManutencaoController {
    @Autowired
    private UpdateManutencaoService updateManutencaoService;


}
