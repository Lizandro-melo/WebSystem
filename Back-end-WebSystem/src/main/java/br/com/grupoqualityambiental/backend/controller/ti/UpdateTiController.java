package br.com.grupoqualityambiental.backend.controller.ti;

import br.com.grupoqualityambiental.backend.service.ti.UpdateTiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
        path = "suporte/update"
)
public class UpdateTiController {

    @Autowired
    private UpdateTiService updateTiService;

    @DeleteMapping(
            path = "solicitacao"
    )
    public ResponseEntity<String> deleteSolicitacao(@RequestParam(
            "id") Integer idSolicitacao)  {
        return ResponseEntity.ok(updateTiService.deleteSolicitacao(idSolicitacao));
    }
}
