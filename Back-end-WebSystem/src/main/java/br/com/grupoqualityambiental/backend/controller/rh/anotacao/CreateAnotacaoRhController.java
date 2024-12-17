package br.com.grupoqualityambiental.backend.controller.rh.anotacao;

import br.com.grupoqualityambiental.backend.models.rh.AnotacaoRhModels;
import br.com.grupoqualityambiental.backend.service.rh.anotacao.CreateAnotacaoRhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
        path = "rh/create/anotacao"
)
public class CreateAnotacaoRhController {

    @Autowired
    private CreateAnotacaoRhService createAnotacaoRhService;

    @PostMapping(
            path = ""
    )
    public ResponseEntity<String> createAnotacao(@RequestBody AnotacaoRhModels anotacao) {
        try {
            return ResponseEntity.ok(createAnotacaoRhService.criarAnotacao(anotacao));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
