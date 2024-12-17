package br.com.grupoqualityambiental.backend.controller.rh.doc;

import br.com.grupoqualityambiental.backend.dto.rh.DocExpirandoAlertRhDTO;
import br.com.grupoqualityambiental.backend.models.rh.ConfigMatriculaRhModels;
import br.com.grupoqualityambiental.backend.models.rh.DocRhModels;
import br.com.grupoqualityambiental.backend.repository.rh.ConfigMatriculaRhRepository;
import br.com.grupoqualityambiental.backend.service.rh.doc.FindDocRhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(
        path = "rh/find"
)
public class FindRhController {

    @Autowired
    private FindDocRhService findRhService;
    @Autowired
    private ConfigMatriculaRhRepository configMatriculaRhRepository;


    @GetMapping(
            path = "doc"
    )
    public ResponseEntity<List<DocRhModels>> getAllDocsColaborador(@RequestParam("id") Integer idColaborador) {
        return ResponseEntity.ok(findRhService.getAllDocs(idColaborador));
    }

    @GetMapping("download/arquivo")
    public ResponseEntity<InputStreamResource> downloadFile(@RequestParam("name") String name) throws IOException {
        String directory = "C:/GrupoQualityWeb/outv2";
        File file = new File(directory + name);

        if (!file.exists()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        try {
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + name);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(file.length())
                    .body(resource);
        } catch (FileNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping(path = "doc/alert")
    public ResponseEntity<List<DocExpirandoAlertRhDTO>> getAllDocsAlert(@RequestParam("id") Integer idColaborador) {
        return ResponseEntity.ok(findRhService.getAllDocsExpirates(idColaborador));
    }

    @GetMapping(path = "num/matricula")
    public ResponseEntity<ConfigMatriculaRhModels> getNumberMatricula() {
        return ResponseEntity.ok(configMatriculaRhRepository.findAll().get(0));
    }
}
