package br.com.grupoqualityambiental.backend.controller.rh.anotacao;

import br.com.grupoqualityambiental.backend.models.rh.AnotacaoRhModels;
import br.com.grupoqualityambiental.backend.service.rh.anotacao.UpdateAnotacaoRhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "rh/update/anotacao")
public class UpdateAnotacaoRhController {

    @Autowired
    private UpdateAnotacaoRhService updateAnotacaoRhService;

    @PutMapping("/atualizar")
    public ResponseEntity<String> atualizarAnotacao(@RequestBody AnotacaoRhModels anotacao) {
        try {
            return ResponseEntity.ok(updateAnotacaoRhService.atualizarAnotacao(anotacao));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar a anotação");
        }
    }

    @DeleteMapping("/inativar")
    public ResponseEntity<String> inativarNota(@RequestParam("id") Integer idAnotacao) {
        try {
            return ResponseEntity.ok(updateAnotacaoRhService.inativarNota(idAnotacao));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar a anotação");
        }
    }

    @GetMapping("/reativar")
    public ResponseEntity<String> reativarNota(@RequestParam("id") Integer idAnotacao) {
        try {
            return ResponseEntity.ok(updateAnotacaoRhService.reativarNota(idAnotacao));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar a anotação");
        }
    }

}
