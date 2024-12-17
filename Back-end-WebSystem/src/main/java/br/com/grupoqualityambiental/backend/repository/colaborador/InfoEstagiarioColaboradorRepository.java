package br.com.grupoqualityambiental.backend.repository.colaborador;

import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoEstagiarioColaboradorModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InfoEstagiarioColaboradorRepository extends JpaRepository<InfoEstagiarioColaboradorModel, Integer> {

}
