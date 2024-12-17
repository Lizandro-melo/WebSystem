package br.com.grupoqualityambiental.backend.enumerated.colaborador;

public enum AuthColaboradorEnum {
    MASTER("master"),
    PRESIDENCIA("presidencia"),
    USER("user");

    private String role;

    AuthColaboradorEnum(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

}
