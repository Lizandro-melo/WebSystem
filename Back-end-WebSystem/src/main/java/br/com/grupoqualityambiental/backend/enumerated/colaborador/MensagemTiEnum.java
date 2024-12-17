package br.com.grupoqualityambiental.backend.enumerated.colaborador;

public enum MensagemTiEnum {
    VISTO("visto"),
    ENVIADO("enviado");

    private String status;

    MensagemTiEnum(String role) {
        this.status = role;
    }

    public String getRole() {
        return this.status;
    }
}
