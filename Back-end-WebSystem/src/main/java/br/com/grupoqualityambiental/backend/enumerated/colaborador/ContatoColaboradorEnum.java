package br.com.grupoqualityambiental.backend.enumerated.colaborador;

public enum ContatoColaboradorEnum {
    PESSOAL("pessoal"),
    EMERGENCIA("emergencia");

    private String tipo;

    ContatoColaboradorEnum(String role) {
        this.tipo = role;
    }

    public String getRole() {
        return this.tipo;
    }
}
