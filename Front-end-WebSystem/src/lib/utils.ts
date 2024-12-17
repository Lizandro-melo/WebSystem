import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {InfoNotifyNotificacaoModels} from "@/lib/models";
import {stateModalNotifyGlobal, stateModalProps} from "@/lib/globalStates";
import {useContext} from "react";
import {MainContext} from "@/provider/main-provider";
import Router from "next/router";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDateTimeUser(dataTimeBancoDados: string | undefined) {
    if (!dataTimeBancoDados) {
        return null;
    }

    const date = new Date(dataTimeBancoDados);

    if (isNaN(date.getTime())) {
        return null;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDateTimeMesInput() {

    const date = new Date();

    if (isNaN(date.getTime())) {
        return null;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() - 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function alterNomeCompletoParaNomeSobrenome(nomeCompleto: string | undefined) {
    if (!nomeCompleto) {
        return
    }
    const nomeDividido = nomeCompleto.split(" ")

    return `${nomeDividido[0]} ${nomeDividido[nomeDividido.length - 1]}`
}

export function formatarDataInput(
    dataString: string | null | any,
): string | null | undefined | any {
    dataString = dataString;
    if (dataString === null || dataString === undefined) {
        return "";
    }

    var partesData = dataString.split("/");
    var dia = partesData[0];
    var mes = partesData[1];
    var ano = partesData[2];

    var dataFormatada = ano + "-" + mes + "-" + dia;
    return dataFormatada;
}

export function formatarDataComum(
    dataString: string | null | undefined,
): string | null | any {
    if (dataString === null || dataString === undefined) {
        return "";
    }

    var partesData = dataString.split("-");
    var dia = partesData[2];
    var mes = partesData[1];
    var ano = partesData[0];

    var dataFormatada = dia + "/" + mes + "/" + ano;
    return dataFormatada;
}

export const data1MesAtrasInput = () => {
    const data1Mes = new Date()
    data1Mes.setDate(data1Mes.getDate() - 30)
    return formatarDataInput(data1Mes.toLocaleDateString());
}

export const dataAtualInput = () => {
    const dataAtual = new Date()
    return formatarDataInput(dataAtual.toLocaleDateString());
}

export async function visualizarNotify(notify: InfoNotifyNotificacaoModels, host: string, configToken: Object | undefined, setStateModal?: any) {

    switch (notify.intensao) {
        case "suporte":
            Router.push("/suporte")
            setStateModal(false)
            break
        case "estoque":
            Router.push("/estoque")
            setStateModal(false)
            break
    }

    await axios.get(`${host}/notify/update/active?id=${notify.id}`, configToken)
}