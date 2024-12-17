package br.com.grupoqualityambiental.backend.enumerated.colaborador;

public enum SolicitacaoTiEnum {
    PENDENTE("pendente"),
    RESPONDIDO("respondido"),
    ANDAMENTO("andamento"),
    FINALIZADO("finalizado");

    private String status;

    SolicitacaoTiEnum(String role) {
        this.status = role;
    }

    public String getRole() {
        return this.status;
    }
}
