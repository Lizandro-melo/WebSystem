package br.com.grupoqualityambiental.backend.service.sistema;

import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.acesso.EstoqueAcessoModel;
import br.com.grupoqualityambiental.backend.models.acesso.RhAcessoModel;
import br.com.grupoqualityambiental.backend.models.acesso.TiAcessoModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.repository.acesso.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UploadSistemaService {

    @Autowired
    private TiAcessoRepository tiAcessoRepository;
    @Autowired
    private RhAcessoRepository rhAcessoRepository;
    @Autowired
    private EstoqueAcessoRepository estoqueAcessoRepository;
    @Autowired
    private BotsAcessoRepository botsAcessoRepository;
    @Autowired
    private AcessoRepository acessoRepository;

    public void updateRolesColaborador(AcessoModel acessoModel) {
        AcessoModel acessoReferent = acessoRepository.findByReferentColaborador(acessoModel.getReferentColaborador());
        if (acessoReferent.getRolesTI() == null && acessoModel.getRolesTI() != null) {
            acessoReferent.setRolesTI(tiAcessoRepository.save(acessoModel.getRolesTI()));
        } else if (acessoModel.getRolesTI() != null) {
            tiAcessoRepository.save(acessoModel.getRolesTI());
        }
        if (acessoReferent.getRolesRH() == null && acessoModel.getRolesRH() != null) {
            acessoReferent.setRolesRH(rhAcessoRepository.save(acessoModel.getRolesRH()));
        } else if (acessoReferent.getRolesRH() != null) {
            rhAcessoRepository.save(acessoModel.getRolesRH());
        }
        if (acessoReferent.getRolesEstoque() == null && acessoModel.getRolesEstoque() != null) {
            acessoReferent.setRolesEstoque(estoqueAcessoRepository.save(acessoModel.getRolesEstoque()));
        } else if (acessoReferent.getRolesEstoque() != null) {
            estoqueAcessoRepository.save(acessoModel.getRolesEstoque());
        }
        if (acessoReferent.getRolesDiversos() == null && acessoModel.getRolesDiversos() != null) {
            acessoReferent.setRolesDiversos(botsAcessoRepository.save(acessoModel.getRolesDiversos()));
        } else if (acessoReferent.getRolesDiversos() != null) {
            botsAcessoRepository.save(acessoModel.getRolesDiversos());
        }
        acessoRepository.save(acessoReferent);
    }

}
