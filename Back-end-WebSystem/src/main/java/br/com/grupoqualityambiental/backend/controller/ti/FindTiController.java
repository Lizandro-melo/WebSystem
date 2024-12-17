package br.com.grupoqualityambiental.backend.controller.ti;

import br.com.grupoqualityambiental.backend.dto.ti.FiltroSolicitacaoFindDTO;
import br.com.grupoqualityambiental.backend.dto.ti.ResponseSocketSolicitacaoTiDTO;
import br.com.grupoqualityambiental.backend.dto.ti.SolicitacaoTiDTO;
import br.com.grupoqualityambiental.backend.dto.ti.SolicitacaoTiWithMotivoDTO;
import br.com.grupoqualityambiental.backend.models.ti.CategoriaClassificacaoTiModels;
import br.com.grupoqualityambiental.backend.models.ti.GrupoClassificacaoTiModels;
import br.com.grupoqualityambiental.backend.models.ti.SubcategoriaTiModels;
import br.com.grupoqualityambiental.backend.service.ti.FindTiService;
import br.com.grupoqualityambiental.backend.service.websocket.SocketTiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.List;

@RestController
@RequestMapping(
        path = "suporte/find"
)
public class FindTiController {

    @Autowired
    private FindTiService findTiService;
    @Autowired
    private SocketTiService socketTiService;

    @GetMapping(
            path = "solicitacao"
    )
    public List<SolicitacaoTiDTO> getSolicitacoes() {
        return findTiService.getSolicitacoes();
    }

    @GetMapping(
            path = "solicitacao/by"
    )
    public List<SolicitacaoTiDTO> getSolicitacoesby(@RequestParam("id") Integer id) {
        return findTiService.getSolicitacoesby(id);
    }


    @PostMapping(
            path = "solicitacao/all"
    )
    public List<SolicitacaoTiWithMotivoDTO> getSolicitacoesAll(@RequestBody FiltroSolicitacaoFindDTO filtro) {
        return findTiService.getSolicitacoesAll(filtro);
    }

    @GetMapping(
            path = "solicitacao/exatc"
    )
    public ResponseEntity<ResponseSocketSolicitacaoTiDTO> getSolicitacaoExatc(@RequestParam("id") Integer id) {
        return ResponseEntity.ok(findTiService.responseSocketSolicitacao(findTiService.getSolicitacao(id)));
    }

    @GetMapping(
            path = "classificar/grupos"
    )
    public ResponseEntity<List<GrupoClassificacaoTiModels>> getGruposClassificar() {
        return ResponseEntity.ok(findTiService.findGrupoClassificacao(true));
    }

    @GetMapping(
            path = "classificar/categorias"
    )
    public ResponseEntity<List<CategoriaClassificacaoTiModels>> getCategoriaClassificar(@RequestParam("id") Integer idGrupo) {
        return ResponseEntity.ok(findTiService.findCategoriaClassificacao(idGrupo, true));
    }

    @GetMapping(
            path = "classificar/categorias/all"
    )
    public ResponseEntity<List<CategoriaClassificacaoTiModels>> getCategoriaClassificarAll() {
        return ResponseEntity.ok(findTiService.findCategoriaAll());
    }

    @GetMapping(
            path = "classificar/subcategorias"
    )
    public ResponseEntity<List<SubcategoriaTiModels>> getSubCategoriaClassificar(@RequestParam("id") Integer idCategoria) {
        return ResponseEntity.ok(findTiService.findSubCategoriaClassificacao(idCategoria, true));
    }


    @GetMapping("download/arquivo")
    public ResponseEntity<InputStreamResource> downloadFile(@RequestParam("name") String name) throws IOException {
        String directory = "C:/GrupoQualityWeb/outv2/assets/arquivosTicket/";
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


}
