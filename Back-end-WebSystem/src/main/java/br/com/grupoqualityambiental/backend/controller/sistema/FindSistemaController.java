package br.com.grupoqualityambiental.backend.controller.sistema;

import br.com.grupoqualityambiental.backend.dto.system.NiverDoMesDTO;
import br.com.grupoqualityambiental.backend.service.sistema.FindSistemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "find/system")
public class FindSistemaController {

    @Autowired
    private FindSistemaService sistemaService;

    @GetMapping(path = "/niver")
    public ResponseEntity<List<NiverDoMesDTO>> FindNiverDoMes(){
        return ResponseEntity.ok(sistemaService.findNiverDoMes());
    }

}
