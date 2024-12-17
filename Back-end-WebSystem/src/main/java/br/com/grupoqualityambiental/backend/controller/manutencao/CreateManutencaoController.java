package br.com.grupoqualityambiental.backend.controller.manutencao;

import br.com.grupoqualityambiental.backend.dto.ti.RequestClassificarDTO;
import br.com.grupoqualityambiental.backend.dto.ti.RequestMensagemTiDTO;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.SolicitacaoTiEnum;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.manutencao.SolicitacaoManutencaoModels;
import br.com.grupoqualityambiental.backend.models.ti.SolicitacaoTiModels;
import br.com.grupoqualityambiental.backend.repository.manutencao.SolicitacaoManutencaoRepository;
import br.com.grupoqualityambiental.backend.service.manutencao.CreateManutencaoService;
import br.com.grupoqualityambiental.backend.service.notificacao.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping(
        path = "manutencao/create"
)
public class CreateManutencaoController {
    @Autowired
    private CreateManutencaoService createManutencaoService;
    @Autowired
    private SolicitacaoManutencaoRepository solicitacaoManutencaoRepository;
    @Autowired
    private NotificacaoService notificacaoService;

    @PostMapping(
            path = "solicitacao"
    )
    public ResponseEntity<String> createSolicitacao(@RequestBody SolicitacaoManutencaoModels requestSolicitacao) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(createManutencaoService.verificarIntegridadeAndCreateSolicitacao(requestSolicitacao));
        } catch (IntegridadeDadosException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

//    @PostMapping(
//            path = "mensagem"
//    )
//    public ResponseEntity<String> createMensagem(@RequestBody RequestMensagemTiDTO request) throws IntegridadeDadosException {
//        try {
//            return ResponseEntity.ok(createManutencaoService.verificarIntegridadeAndCreateSolicitacao(request));
//        } catch (IntegridadeDadosException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

//    @PostMapping(
//            path = "finalizar"
//    )
//    public ResponseEntity<String> finalizarTicket(@RequestBody RequestClassificarDTO classificacao) {
//
//    }

    @PostMapping(
            path = "update/files"
    )
    public ResponseEntity<String> updateFiles(@RequestParam("file") MultipartFile file,
                                              @RequestParam(
                                                      "dir") String dir) {
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
