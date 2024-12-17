package br.com.grupoqualityambiental.backend.controller.manutencao;

import br.com.grupoqualityambiental.backend.service.manutencao.FindManutencaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
        path = "manutencao/find"
)
public class FindManutencaoController {
    @Autowired
    private FindManutencaoService findManutencaoService;
}
