package br.com.grupoqualityambiental.backend.controller.ti;

import br.com.grupoqualityambiental.backend.dto.ti.RequestClassificarDTO;
import br.com.grupoqualityambiental.backend.dto.ti.RequestMensagemTiDTO;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.SolicitacaoTiEnum;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.ti.SolicitacaoTiModels;
import br.com.grupoqualityambiental.backend.repository.ti.SolicitacaoTiRepository;
import br.com.grupoqualityambiental.backend.service.notificacao.NotificacaoService;
import br.com.grupoqualityambiental.backend.service.ti.CreateTiService;
import br.com.grupoqualityambiental.backend.service.ti.FindTiService;
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
        path = "suporte/create"
)
public class CreateTiController {

    @Autowired
    private FindTiService findTiService;
    @Autowired
    private CreateTiService createTiService;
    @Autowired
    private SolicitacaoTiRepository solicitacaoTiRepository;
    @Autowired
    private NotificacaoService notificacaoService;


    @PostMapping(
            path = "solicitacao"
    )
    public ResponseEntity<String> createSolicitacao(@RequestBody SolicitacaoTiModels requestSolicitacao) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(createTiService.verificarIntegridadeAndCreateSolicitacao(requestSolicitacao));
        } catch (IntegridadeDadosException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(
            path = "mensagem"
    )
    public ResponseEntity<String> createMensagem(@RequestBody RequestMensagemTiDTO request) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(createTiService.verficarIntegridadeAndSendMensagem(request));
        } catch (IntegridadeDadosException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(
            path = "classificar"
    )
    public ResponseEntity<String> classificarTicket(@RequestBody RequestClassificarDTO classificacao) {
        createTiService.verificarIntegridadeAndClassificarTicket(classificacao);
        return ResponseEntity.ok("Solicitação finalizada com " +
                "sucesso");
    }

    @PostMapping(
            path = "reclassificar"
    )
    public ResponseEntity<String> reclassificarTicket(@RequestBody RequestClassificarDTO classificacao) {
        createTiService.verificarIntegridadeAndReClassificarTicket(classificacao);
        return ResponseEntity.ok("Solicitação reclassificada com " +
                "sucesso");
    }


    @PostMapping(
            path = "finalizar"
    )
    public ResponseEntity<String> finalizarTicket(@RequestBody RequestClassificarDTO classificacao) {
        SolicitacaoTiModels solicitacao =
                solicitacaoTiRepository.findById(classificacao.referentSolicitacao().longValue()).get();
        solicitacao.setStatus(SolicitacaoTiEnum.FINALIZADO);
        solicitacao.setDataHoraFinalizado(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        solicitacaoTiRepository.save(solicitacao);
        notificacaoService.createNotificationColaboradorIntension("Sua solicitação " + solicitacao.getId() + " finalizada!", "Sua Solicitação foi finalizada, você pode verificar no historico a conclusão da mesma!", solicitacao.getSolicitante().intValue(), "suporte");
        return ResponseEntity.ok("Solicitação finalizada com " +
                "sucesso");
    }

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
