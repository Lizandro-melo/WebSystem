package br.com.grupoqualityambiental.backend.service.rh.doc;

import br.com.grupoqualityambiental.backend.exception.rh.DocExistenteException;
import br.com.grupoqualityambiental.backend.models.rh.DocRhModels;
import br.com.grupoqualityambiental.backend.repository.rh.DocRhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class CreateDocRhService {

    @Autowired
    private DocRhRepository docRhRepository;
    @Autowired
    private SimpMessagingTemplate brokerMessagingTemplate;

    public String insertDoc(DocRhModels doc) throws DocExistenteException {
        DocRhModels docReferent = docRhRepository.findByReferentColaboradorAndTipo(doc.getReferentColaborador(), doc.getTipo());
        switch (doc.getTipo()) {
            case IDENTIDADE:
                if (docRhRepository.findByReferentColaboradorAndTipo(doc.getReferentColaborador(), doc.getTipo()) != null) {
                    DocExistenteException exception = new DocExistenteException("Já existe uma identidade vinculada a este colaborador!");
                    exception.setTipoDoc("uma Identidade", docReferent);
                    throw exception;
                }
                break;
            case CPF:
                if (docRhRepository.findByReferentColaboradorAndTipo(doc.getReferentColaborador(), doc.getTipo()) != null) {
                    DocExistenteException exception = new DocExistenteException("Já existe um CPF vinculado a este colaborador!");
                    exception.setTipoDoc("um CPF", docReferent);
                    throw exception;
                }
                break;
            case CNH:
                if (docRhRepository.findByReferentColaboradorAndTipo(doc.getReferentColaborador(), doc.getTipo()) != null) {
                    DocExistenteException exception = new DocExistenteException("Já existe uma CNH vinculada a este colaborador!");
                    exception.setTipoDoc("uma CNH", docReferent);
                    throw exception;
                }
                break;
            case TITULOELEITOR:
                if (docRhRepository.findByReferentColaboradorAndTipo(doc.getReferentColaborador(), doc.getTipo()) != null) {
                    DocExistenteException exception = new DocExistenteException("Já existe um titulo de eleitor vinculado a este colaborador!");
                    exception.setTipoDoc("um titulo de eleitor", docReferent);
                    throw exception;
                }
                break;
            case COMPROVANTERESIDENCIA:
                if (docRhRepository.findByReferentColaboradorAndTipo(doc.getReferentColaborador(), doc.getTipo()) != null) {
                    DocExistenteException exception = new DocExistenteException("Já existe um comprovante de residencia vinculado a este colaborador!");
                    exception.setTipoDoc("um comprovante de residencia", docReferent);
                    throw exception;
                }
                break;
        }
        docRhRepository.save(doc);
        return "Documento importado com sucesso";
    }
}
