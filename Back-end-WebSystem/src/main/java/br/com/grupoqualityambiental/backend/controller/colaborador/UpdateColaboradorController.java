package br.com.grupoqualityambiental.backend.controller.colaborador;

import br.com.grupoqualityambiental.backend.dto.colaborador.InfoColaboradorCompletoDTO;
import br.com.grupoqualityambiental.backend.service.colaborador.UpdateColaboradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping(path = "colaborador/update")
public class UpdateColaboradorController {

    @Autowired
    private UpdateColaboradorService updateColaboradorService;

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

    @PutMapping(path = "/dados")
    public ResponseEntity<String> updateDadosColaborador(@RequestBody InfoColaboradorCompletoDTO informacoes) {
        try {

            return ResponseEntity.ok(updateColaboradorService.atualizarDados(informacoes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Não foi possivel atualizar os dados!.");

        }
    }

    @GetMapping(path = "/promover")
    public ResponseEntity<String> promoverEstagiario(@RequestParam("id") Integer id, @RequestParam("data") LocalDate dataInicio) {
        try {
            return ResponseEntity.ok(updateColaboradorService.promoverEstagiario(id, dataInicio));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    @GetMapping(path = "/desligar")
    public ResponseEntity<String> desligarColaborador(@RequestParam("id") Integer id, @RequestParam("data") LocalDate dataInicio) {
        try {
            return ResponseEntity.ok(updateColaboradorService.desligarColaborador(id, dataInicio));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    @GetMapping(path = "/reativar")
    public ResponseEntity<String> reativarColaborador(@RequestParam("id") Integer id, @RequestParam("data") LocalDate dataInicio) {
        try {
            return ResponseEntity.ok(updateColaboradorService.reativarColaborador(id, dataInicio));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }
}
