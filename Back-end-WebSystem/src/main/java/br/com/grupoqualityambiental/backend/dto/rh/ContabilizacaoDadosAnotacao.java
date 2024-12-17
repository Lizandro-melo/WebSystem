package br.com.grupoqualityambiental.backend.dto.rh;

import br.com.grupoqualityambiental.backend.models.rh.AnotacaoRhModels;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class ContabilizacaoDadosAnotacao {

    private Integer atestado = 0;
    private Integer ferias = 0;
    private Integer faltou = 0;
    private Integer suspensao = 0;
    private Integer licenca = 0;
    private Integer atestadoHora = 0;
    private Integer advEscrita = 0;
    private Integer advVerbal = 0;
    private Float horasExtras = 0F;
    private Float bancoHoras;
    private Float horasPositivas;
    private Float horasNegativas;
    private Integer atrasos = 0;
    private Float atrasoTempo = 0F;

    public ContabilizacaoDadosAnotacao(List<AnotacaoRhModels> anotacoes) {
        float totalHorasPositivo = 0F;
        float totalHorasNegativo = 0F;
        for (AnotacaoRhModels anotacao : anotacoes) {
            if (anotacao.getBancoPositivo() != null) {
                if (anotacao.getBancoPositivo() > 0F) {
                    totalHorasPositivo += anotacao.getBancoPositivo();
                }
            }
            if (anotacao.getBancoNegativo() != null) {
                if (anotacao.getBancoNegativo() > 0F) {
                    totalHorasNegativo += anotacao.getBancoNegativo();
                }
            }
            if (anotacao.getAtestado()) {
                this.atestado++;
            }
            if (anotacao.getFerias()) {
                this.ferias++;
            }
            if (anotacao.getFaltou()) {
                this.faltou++;
            }
            if (anotacao.getSuspensao()) {
                this.suspensao++;
            }
            if (anotacao.getLicenca()) {
                this.licenca++;
            }
            if (anotacao.getAtestadoHora()) {
                this.atestadoHora++;
            }
            if (anotacao.getAdvEscrita()) {
                this.advEscrita++;
            }
            if (anotacao.getAdvVerbal()) {
                this.advVerbal++;
            }
            if (anotacao.getHoraExtra() > 0F) {
                this.horasExtras += anotacao.getHoraExtra();
            }
            if (anotacao.getAtraso()) {
                this.atrasos++;
            }
            if (anotacao.getAtrasoTempo() != null) {
                if (anotacao.getAtrasoTempo() > 0) {
                    this.atrasoTempo += anotacao.getAtrasoTempo();
                }
            }
        }
        bancoHoras = totalHorasPositivo - totalHorasNegativo;
        horasPositivas = totalHorasPositivo;
        horasNegativas = totalHorasNegativo;
    }
}
