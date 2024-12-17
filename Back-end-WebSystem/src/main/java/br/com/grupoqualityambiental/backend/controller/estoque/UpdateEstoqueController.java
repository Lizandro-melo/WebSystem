package br.com.grupoqualityambiental.backend.controller.estoque;

import br.com.grupoqualityambiental.backend.dto.estoque.AtualizarItemDTO;
import br.com.grupoqualityambiental.backend.dto.estoque.SolicitacaoItensEstoqueDTO;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.estoque.ItemEstoqueModel;
import br.com.grupoqualityambiental.backend.service.estoque.CreateEstoqueService;
import br.com.grupoqualityambiental.backend.service.estoque.UpdateEstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(path = "estoque/update")
public class UpdateEstoqueController {

    @Autowired
    private UpdateEstoqueService updateEstoqueService;

    @PutMapping(path = "/solicitacao")
    public ResponseEntity<String> createSolicitacao(@RequestBody List<SolicitacaoItensEstoqueDTO> solicitacoes) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(updateEstoqueService.darBaixa(solicitacoes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping(path = "/solicitacao/deletar")
    public ResponseEntity<String> deletarSolicitacao(@RequestParam("id") Integer id) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(updateEstoqueService.deletarSolicitacao(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(path = "/item")
    public ResponseEntity<String> updateItem(@RequestBody AtualizarItemDTO itemAtualizar) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(updateEstoqueService.atualizarItem(itemAtualizar));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(path = "/item/desativar")
    public ResponseEntity<String> desativarItem(@RequestBody ItemEstoqueModel item) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(updateEstoqueService.desativarItem(item));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(path = "/item/ativar")
    public ResponseEntity<String> ativarItem(@RequestBody ItemEstoqueModel item) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(updateEstoqueService.ativarItem(item));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(path = "/foto")
    public ResponseEntity<String> updateFiles(@RequestParam("file") MultipartFile file, @RequestParam("dir") String dir) {
        try {
            String filePath = dir + "/" + file.getOriginalFilename();
            file.transferTo(new File(filePath));
            return ResponseEntity.ok(file.getOriginalFilename());
        } catch (IOException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body("");
        }
    }
}
