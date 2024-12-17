package br.com.grupoqualityambiental.backend.controller.estoque;

import br.com.grupoqualityambiental.backend.dto.estoque.SolicitacaoItensEstoqueDTO;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.estoque.CategoriaEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.ItemEstoqueModel;
import br.com.grupoqualityambiental.backend.service.estoque.CreateEstoqueService;
import br.com.grupoqualityambiental.backend.service.estoque.FindEstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "estoque/create")
public class CreateEstoqueController {

    @Autowired
    private CreateEstoqueService createEstoqueService;

    @PostMapping(path = "/solicitacao")
    public ResponseEntity<String> createSolicitacao(@RequestBody SolicitacaoItensEstoqueDTO solicitacao) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(createEstoqueService.createSolicitacaoEstoque(solicitacao));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
