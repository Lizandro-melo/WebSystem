package br.com.grupoqualityambiental.backend.repository.ti;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.SolicitacaoTiEnum;
import br.com.grupoqualityambiental.backend.models.ti.SolicitacaoTiModels;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SolicitacaoTiRepository extends JpaRepository<SolicitacaoTiModels, Long> {
    List<SolicitacaoTiModels> findAllByStatus(SolicitacaoTiEnum status);

    List<SolicitacaoTiModels> findBySolicitante(Integer id);

    List<SolicitacaoTiModels> findByDataHoraBetween(LocalDateTime localDateTime, LocalDateTime now);


    List<SolicitacaoTiModels> findBySolicitanteAndDataHoraBetween(Integer solicitante, LocalDateTime dataInicio, LocalDateTime dataFim);

    SolicitacaoTiModels findByIdAndSolicitante(long l, Integer solicitante);
}
