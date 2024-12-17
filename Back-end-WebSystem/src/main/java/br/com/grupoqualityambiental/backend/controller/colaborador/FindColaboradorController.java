package br.com.grupoqualityambiental.backend.controller.colaborador;

import br.com.grupoqualityambiental.backend.dto.colaborador.InfoColaboradorCompletoDTO;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.TipoColaboradorEnum;
import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.colaborador.EmpresaColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.SetorColaboradorModel;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.service.colaborador.FindColaboradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "colaborador/find")
public class FindColaboradorController {
    @Autowired
    private FindColaboradorService findColaboradorService;
    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;

    @GetMapping(
            path = "/ativos"
    )
    public List<InfoColaboradorModel> getAtivos() {
        return findColaboradorService.getAllColaboradoresAtivos();
    }

    @GetMapping(
            path = "/colaboradores"
    )
    public List<InfoColaboradorModel> getAtivos(@RequestParam("nome") String nome, @RequestParam("tipo") String tipo) {
        TipoColaboradorEnum tipoColaborador = TipoColaboradorEnum.valueOf(tipo.toUpperCase());
        return findColaboradorService.findByFiltro(nome, tipoColaborador);
    }

    @GetMapping(
            path = "/roles"
    )
    public AcessoModel getRoles(@RequestParam("id") Integer id) {
        return findColaboradorService.GetAcessoById(id);
    }

    @GetMapping(
            path = "/empresas"
    )
    public List<EmpresaColaboradorModel> getEmpresas() {
        return findColaboradorService.getEmpresas();
    }

    @GetMapping(
            path = "/setores"
    )
    public List<SetorColaboradorModel> getSetores() {
        return findColaboradorService.getSetor();
    }

    @GetMapping(
            path = "/completo"
    )
    public InfoColaboradorCompletoDTO getCompleto(@RequestParam("id") Integer id) {
        return findColaboradorService.getAllInfoCompletasColaborador(id);
    }

    @GetMapping(
            path = "/by"
    )
    public InfoColaboradorModel getBy(@RequestParam("id") Integer id) {
        return infoColaboradorRepository.findById(id.longValue()).get();
    }
}
