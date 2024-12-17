package br.com.grupoqualityambiental.backend.repository.colaborador;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.TipoColaboradorEnum;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InfoColaboradorRepository extends JpaRepository<InfoColaboradorModel, Long> {
    List<InfoColaboradorModel> findByNomeCompletoContainingIgnoreCase(String nome);

    List<InfoColaboradorModel> findByNomeCompletoContainingIgnoreCaseAndTipo(String nome, TipoColaboradorEnum tipo);

    List<InfoColaboradorModel> findAllByTipo(TipoColaboradorEnum tipoColaboradorEnum);

    InfoColaboradorModel findByCpf(String cpf);
}
