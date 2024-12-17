package br.com.grupoqualityambiental.backend.repository.manutencao;

import br.com.grupoqualityambiental.backend.models.manutencao.SolicitacaoManutencaoModels;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitacaoManutencaoRepository extends JpaRepository<SolicitacaoManutencaoModels, Long> {
}
