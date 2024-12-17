package br.com.grupoqualityambiental.backend.exception.rh;

import br.com.grupoqualityambiental.backend.dto.rh.TipoDocRhDTO;
import br.com.grupoqualityambiental.backend.models.rh.DocRhModels;

public class DocExistenteException extends Exception {

    private String tipo;
    private DocRhModels doc;

    public DocExistenteException(String msg) {
        super(msg);
    }

    public void setTipoDoc(String tipo, DocRhModels doc) {
        this.tipo = tipo;
        this.doc = doc;
    }

    public TipoDocRhDTO sendTipoDoc() {
        return new TipoDocRhDTO(tipo, doc);
    }
}
