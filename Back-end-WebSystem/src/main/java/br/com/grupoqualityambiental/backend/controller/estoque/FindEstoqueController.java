package br.com.grupoqualityambiental.backend.controller.estoque;

import br.com.grupoqualityambiental.backend.dto.estoque.MovimentacaoEstoqueDTO;
import br.com.grupoqualityambiental.backend.dto.estoque.SolicitacaoItensEstoqueDTO;
import br.com.grupoqualityambiental.backend.models.estoque.CategoriaEstoqueModel;
import br.com.grupoqualityambiental.backend.models.estoque.ItemEstoqueModel;
import br.com.grupoqualityambiental.backend.service.estoque.FindEstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "estoque/find")
public class FindEstoqueController {

    @Autowired
    private FindEstoqueService findEstoqueService;


    @GetMapping(path = "/itens")
    public List<ItemEstoqueModel> getAllItens(@RequestParam(name = "nome") String nome, @RequestParam(name = "categoria") String categoria) {
        return findEstoqueService.findAllItensFilter(nome, categoria);
    }

    @GetMapping(path = "/categorias")
    public List<CategoriaEstoqueModel> getAllCategorias() {
        return findEstoqueService.findAllCategorias();
    }

    @GetMapping(path = "/solicitacoes")
    public List<SolicitacaoItensEstoqueDTO> getAllSolicitacoes() {
        return findEstoqueService.getAllSolicitacoes();
    }

    @GetMapping(path = "/solicitacoes/my")
    public List<SolicitacaoItensEstoqueDTO> getMySolicitacoes(@RequestParam("id") Integer id) {
        return findEstoqueService.getMySolicitacoes(id);
    }

    @GetMapping(path = "/movimentacao")
    public List<MovimentacaoEstoqueDTO> getAllMovimentacoes() {
        return findEstoqueService.getAllMovimentacoes();
    }

    @GetMapping(path = "/alerta")
    public List<ItemEstoqueModel> getAllAlertas() {
        return findEstoqueService.getAllAlert();
    }
}
