package br.com.grupoqualityambiental.backend.controller.rh.anotacao;

import br.com.grupoqualityambiental.backend.dto.rh.ConfigVotacaoRhDTO;
import br.com.grupoqualityambiental.backend.dto.rh.ResponseFindAnotacaoRhDTO;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.TipoColaboradorEnum;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.rh.CandidatosRhModel;
import br.com.grupoqualityambiental.backend.models.rh.ConfigVotacaoRhModel;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.rh.CandidatosRhRepository;
import br.com.grupoqualityambiental.backend.repository.rh.ConfigVotacaoRhRepository;
import br.com.grupoqualityambiental.backend.service.rh.anotacao.FindAnotacaoRhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "rh/find/anotacao")
public class FindAnotacaoRhController {
    @Autowired
    private FindAnotacaoRhService findAnotacaoRhService;
    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;
    @Autowired
    private ConfigVotacaoRhRepository configVotacaoRhRepository;
    @Autowired
    private CandidatosRhRepository candidatosRhRepository;

    @GetMapping(path = "/filter")
    public ResponseFindAnotacaoRhDTO getAnotacoes(@RequestParam("anotacao") String anotacao, @RequestParam("motivo") String motivo, @RequestParam("id") Integer idColaborador, @RequestParam("tipo") String tipo, @RequestParam("status") Boolean status, @RequestParam("dataInicio") LocalDate dataInicio, @RequestParam("dataFim") LocalDate dataFim) {
        return findAnotacaoRhService.getAnotacaoColaborador(anotacao, motivo, idColaborador, tipo, status, dataInicio, dataFim);
    }

    @GetMapping(path = "/filter/relatorio/segvia")
    public ResponseFindAnotacaoRhDTO getAnotacoesSegundaVia(@RequestParam("anotacao") String anotacao, @RequestParam("motivo") String motivo, @RequestParam("id") Integer idColaborador, @RequestParam("tipo") String tipo, @RequestParam("status") Boolean status, @RequestParam("dataInicio") LocalDate dataInicio, @RequestParam("dataFim") LocalDate dataFim) {
        ResponseFindAnotacaoRhDTO dadosMes = findAnotacaoRhService.getAnotacaoColaborador(anotacao, motivo, idColaborador, tipo, status, dataInicio, dataFim);
        Integer mes = null;
        if (dataInicio.getMonthValue() - 6 <= 0) {
            mes = 1;
        } else {
            mes = dataInicio.getMonthValue() - 6;
        }

        LocalDate dataSeisMesesAtras = LocalDate.of(dataInicio.getYear(), Month.of(mes), dataInicio.getDayOfMonth());

        ResponseFindAnotacaoRhDTO dadosSeisMeses = findAnotacaoRhService.getAnotacaoColaborador(anotacao, motivo, idColaborador, tipo, status, dataSeisMesesAtras, dataFim);
        dadosMes.dadosContabilizados().setBancoHoras(dadosSeisMeses.dadosContabilizados().getBancoHoras());
        return dadosMes;
    }

    @GetMapping(path = "/filter/relatorio/all")
    public List<ResponseFindAnotacaoRhDTO> getAnotacoesAll(@RequestParam("anotacao") String anotacao, @RequestParam("motivo") String motivo, @RequestParam("tipo") String tipo, @RequestParam("status") Boolean status, @RequestParam("dataInicio") LocalDate dataInicio, @RequestParam("dataFim") LocalDate dataFim) {
        List<ResponseFindAnotacaoRhDTO> todos = new ArrayList<>();
        for (InfoColaboradorModel colaboradorCLT : infoColaboradorRepository.findAllByTipo(TipoColaboradorEnum.CLT)) {
            ResponseFindAnotacaoRhDTO dadosMes = findAnotacaoRhService.getAnotacaoColaborador(anotacao, motivo, colaboradorCLT.getFkAuth().intValue(), tipo, status, dataInicio, dataFim);
            Integer mes = null;
            if (dataInicio.getMonthValue() - 6 <= 0) {
                mes = 1;
            } else {
                mes = dataInicio.getMonthValue() - 6;
            }
            LocalDate dataSeisMesesAtras = LocalDate.of(dataInicio.getYear(), Month.of(mes), dataInicio.getDayOfMonth());
            ResponseFindAnotacaoRhDTO dadosSeisMeses = findAnotacaoRhService.getAnotacaoColaborador(anotacao, motivo, colaboradorCLT.getFkAuth().intValue(), tipo, status, dataSeisMesesAtras, dataFim);
            dadosMes.dadosContabilizados().setBancoHoras(dadosSeisMeses.dadosContabilizados().getBancoHoras());
            todos.add(dadosMes);
        }

        return todos;
    }

    @GetMapping("download/arquivo")
    public ResponseEntity<InputStreamResource> downloadFile(@RequestParam("name") String name) throws IOException {
        String directory = "C:/GrupoQualityWeb/outv2/assets/rh/doc/";
        File file = new File(directory + name);

        if (!file.exists()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        try {
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + name);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");

            return ResponseEntity.ok().headers(headers).contentLength(file.length()).body(resource);
        } catch (FileNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("config/votacao")
    public ConfigVotacaoRhDTO getConfigVotacao() {
        List<InfoColaboradorModel> candidatos = new ArrayList<>();
        for (CandidatosRhModel candidato : candidatosRhRepository.findAll()) {
            InfoColaboradorModel candidatoReferent = infoColaboradorRepository.findById(candidato.getCandidato().longValue()).get();
            candidatos.add(candidatoReferent);
        }
        return new ConfigVotacaoRhDTO(configVotacaoRhRepository.findAll().get(0), candidatos);
    }
}
