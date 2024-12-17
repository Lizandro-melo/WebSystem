package br.com.grupoqualityambiental.backend.controller.sistema;

import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.service.sistema.CreateSistemaService;
import br.com.grupoqualityambiental.backend.service.sistema.UploadSistemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(path = "sistema/upload")
public class UploadSistemaController {

    @Autowired
    private UploadSistemaService uploadSistemaService;
    @Autowired
    private CreateSistemaService createSistemaService;

    @PutMapping(
            path = "/roles"
    )
    private ResponseEntity<String> updateRoles(@RequestBody AcessoModel acesso) {
        uploadSistemaService.updateRolesColaborador(acesso);
        return ResponseEntity.ok("Permissões atualizadas com sucesso!");
    }


    @GetMapping(
            path = "/create/acesso"
    )
    private ResponseEntity<String> createAcessosColaborador(@RequestParam("id") Integer idColaborador) {
        createSistemaService.createRolesColaborador(idColaborador);
        return ResponseEntity.ok("Acesso pronto para configurar!");
    }
}
