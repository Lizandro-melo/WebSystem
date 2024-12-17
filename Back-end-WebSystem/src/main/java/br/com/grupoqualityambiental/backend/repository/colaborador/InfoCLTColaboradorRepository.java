package br.com.grupoqualityambiental.backend.repository.colaborador;

import br.com.grupoqualityambiental.backend.models.colaborador.InfoCLTColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InfoCLTColaboradorRepository extends JpaRepository<InfoCLTColaboradorModel, Integer> {

}
