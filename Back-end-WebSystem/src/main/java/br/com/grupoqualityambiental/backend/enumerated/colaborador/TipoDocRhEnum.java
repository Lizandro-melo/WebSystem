package br.com.grupoqualityambiental.backend.enumerated.colaborador;

public enum TipoDocRhEnum {
    IDENTIDADE("Identidade"),
    CPF("CPF"),
    TITULOELEITOR("Título de eleitor"),
    COMPROVANTERESIDENCIA("Comprovante de residencia"),
    ASO("aso"),
    EXAMECOMPLEMENTAR("Exame complementar"),
    CNH("CNH"),
    DECLARACAO("Declaração"),
    CONTRATO("Contrato"),
    CERTIFICADO("Certificado"),
    OUTROS("Outros"),
    ;

    private String tipo;

    TipoDocRhEnum(String role) {
        this.tipo = role;
    }

    public String getRole() {
        return this.tipo;
    }
}
