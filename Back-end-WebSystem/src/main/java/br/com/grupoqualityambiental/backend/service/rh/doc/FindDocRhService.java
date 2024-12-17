package br.com.grupoqualityambiental.backend.service.rh.doc;

import br.com.grupoqualityambiental.backend.dto.rh.DocExpirandoAlertRhDTO;
import br.com.grupoqualityambiental.backend.models.rh.DocRhModels;
import br.com.grupoqualityambiental.backend.repository.rh.DocRhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class FindDocRhService {

    @Autowired
    private DocRhRepository docRhRepository;

    public List<DocRhModels> getAllDocs(Integer id) {
        return docRhRepository.findByReferentColaborador(id);
    }

    public List<DocExpirandoAlertRhDTO> getAllDocsExpirates(Integer idColaborador) {
        List<DocExpirandoAlertRhDTO> listAlert = new ArrayList<>();
        for (DocRhModels docReferent : docRhRepository.findByReferentColaborador(idColaborador)) {
            if (docReferent.getDataVencimento() == null) {
                continue;
            }
            long dias = ChronoUnit.DAYS.between(LocalDate.now(), docReferent.getDataVencimento());
            if (dias <= 60) {
                listAlert.add(new DocExpirandoAlertRhDTO(docReferent, dias));
            }
        }
        return listAlert;
    }
}
