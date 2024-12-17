import {
    colaboradorSelectGlobal,
    colaboradorSelectGlobalProps,
    dadosRelatorioHorasTodosGlobal,
    dadosRelatorioHorasTodosProps,
    dadosRelatorioSegundaViaGlobal,
    dadosRelatorioSegundaViaProps,
    stateAlertDialogGlobal,
    stateAlertDialogGlobalProps,
    stateLoundingGlobal,
    stateLoundingGlobalProps,
    stateModalAnotacaoRelatorioGlobal,
    stateModalProps,
} from "@/lib/globalStates";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ListColaboradoresAtivos from "@/components/diversos/essential/ListColaboradoresAtivos";

import {
    data1MesAtrasInput,
    dataAtualInput,
    formatarDataComum,
    formatarDataInput,
} from "@/lib/utils";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {
    InfoColaboradorCompletoDTO,
    ResponseFindAnotacaoRhDTO,
} from "@/lib/models";
import axios from "axios";
import {useMutation, useQuery} from "react-query";
import {MainContext} from "@/provider/main-provider";
import {Button} from "@/components/ui/button";
import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import Router from "next/router";
import ContainerSystem from "@/components/container/container-system";


type filtroProps = {
    anotacao: string;
    tipo: string;
    status: boolean;
    dataInicio: string;
    dataFim: string;
    idColaborador: string;
};
export default function ModalGerarRelatorioRh() {
    const state = stateModalAnotacaoRelatorioGlobal<stateModalProps>(
        (state) => state,
    );
    const dadosSegundaVia =
        dadosRelatorioSegundaViaGlobal<dadosRelatorioSegundaViaProps>(
            (state) => state,
        );
    const dadosTodos =
        dadosRelatorioHorasTodosGlobal<dadosRelatorioHorasTodosProps>(
            (state) => state,
        );
    const {host, configToken} = useContext(MainContext);
    const {colaborador} = colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
        (state: any) => state,
    );
    const {data: colaboradorRequest, refetch} = useQuery({
        queryKey: "infoFullColaborador",
        queryFn: async () => {
            return await axios
                .get(
                    `${host}/colaborador/find/completo?id=${colaborador?.fkAuth}`,
                    configToken,
                )
                .then(async (response) => {
                    const colaborador: InfoColaboradorCompletoDTO = response.data;
                    return colaborador;
                });
        },
        enabled: !!colaborador?.fkAuth && !!configToken,
    });
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );

    const [filtro, setFiltro] = useState<filtroProps>({
        anotacao: "",
        tipo: "",
        status: true,
        dataInicio: data1MesAtrasInput(),
        dataFim: dataAtualInput(),
        idColaborador: "",
    });
    const stateAlert = stateAlertDialogGlobal<stateAlertDialogGlobalProps>(
        (state) => state,
    );

    const alterFiltro = (e: ChangeEvent<any>) => {
        const {name, value} = e.target;
        if (name === "status") {
            setFiltro((prevState: any) => ({
                ...prevState,
                status: value === "true",
            }));
            return;
        }
        if (name === "dataInicio") {
            dadosSegundaVia.setDataInicial(value);
        }
        if (name === "dataFinal") {
            dadosSegundaVia.setDataFinal(value);
        }
        setFiltro((prevState: any) => ({...prevState, [name]: value}));
    };

    useEffect(() => {
        if (!colaborador) {
            return;
        }
        setFiltro((prevState) => ({
            ...prevState,
            tipo: colaborador?.tipo,
            idColaborador: colaborador.fkAuth.toString()!,
        }));
        refetch();
    }, [colaborador]);

    const {mutateAsync: relatorioSegundaVia} = useMutation({
        mutationFn: async () => {
            displayLounding.setDisplayLounding();
            dadosSegundaVia.setDataInicial(filtro.dataInicio);
            dadosSegundaVia.setDataFinal(filtro.dataFim);
            await axios
                .get(
                    `${host}/rh/find/anotacao/filter/relatorio/segvia?anotacao=${filtro.anotacao}&id=${colaborador?.fkAuth}&tipo=${filtro.tipo}&status=${filtro.status}&dataInicio=${filtro.dataInicio}&dataFim=${filtro.dataFim}`,
                    configToken,
                )
                .then((response) => {
                    displayLounding.setDisplaySuccess("Consulta feita com sucesso!");
                    const anotacoes: ResponseFindAnotacaoRhDTO = response.data;
                    dadosSegundaVia.setDados(anotacoes);
                    state.alterState();
                    Router.push("/rh/relatorio/horas/unique");
                    displayLounding.setDisplayReset();
                })
                .catch(async () => {
                    displayLounding.setDisplayFailure(
                        "Não foi possivel fazer a consulta no momento",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    displayLounding.setDisplayReset();
                    if (!colaborador?.fkAuth) {
                        stateAlert.setAlert(
                            "Atenção",
                            "Para gerar um relatorio geral ou segunda via, precisa selecionar um colaborador",
                            () => {
                            },
                        );
                    }
                });
        },
    });

    const {mutateAsync: relatoriosTodos} = useMutation({
        mutationFn: async () => {
            dadosTodos.setDataInicial(filtro.dataInicio);
            dadosTodos.setDataFinal(filtro.dataFim);
            await axios
                .get(
                    `${host}/rh/find/anotacao/filter/relatorio/all?anotacao=${filtro.anotacao}&tipo=CLT&status=${filtro.status}&dataInicio=${filtro.dataInicio}&dataFim=${filtro.dataFim}`,
                    configToken,
                )
                .then((response) => {
                    displayLounding.setDisplaySuccess("Consulta feita com sucesso!");
                    const anotacoes: ResponseFindAnotacaoRhDTO[] = response.data;
                    dadosTodos.setDados(anotacoes);
                    state.alterState();
                    Router.push("/rh/relatorio/horas/all");
                    displayLounding.setDisplayReset();
                })
                .catch(async () => {
                    displayLounding.setDisplayFailure(
                        "Não foi possivel fazer a consulta no momento",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    displayLounding.setDisplayReset();
                });
        },
    });
    const {mutateAsync: relatorioGeral} = useMutation({
        mutationFn: async () => {
            dadosSegundaVia.setDataInicial(filtro.dataInicio);
            dadosSegundaVia.setDataFinal(filtro.dataFim);
            await axios
                .get(
                    `${host}/rh/find/anotacao/filter/relatorio/segvia?anotacao=${filtro.anotacao}&id=${colaborador?.fkAuth}&tipo=${filtro.tipo}&status=${filtro.status}&dataInicio=${filtro.dataInicio}&dataFim=${filtro.dataFim}`,
                    configToken,
                )
                .then((response) => {
                    displayLounding.setDisplaySuccess("Consulta feita com sucesso!");
                    const anotacoes: ResponseFindAnotacaoRhDTO = response.data;
                    dadosSegundaVia.setDados(anotacoes);
                    state.alterState();
                    Router.push("/rh/relatorio/geral");
                    displayLounding.setDisplayReset();
                })
                .catch(async () => {
                    displayLounding.setDisplayFailure(
                        "Não foi possivel fazer a consulta no momento",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    displayLounding.setDisplayReset();
                    if (!colaborador?.fkAuth) {
                        stateAlert.setAlert(
                            "Atenção",
                            "Para gerar um relatorio geral ou segunda via, precisa selecionar um colaborador",
                            () => {
                            },
                        );
                    }
                });
        },
    });

    return (
        <>
            <Dialog open={state.stateModal} onOpenChange={state.alterState}>
                <DialogContent className="!max-w-[68rem] min-h-[90%]">
                    <DialogHeader>
                        <DialogTitle>Gerar relatório</DialogTitle>
                        <DialogDescription>
                            Você irá conseguir puxar dados com base no historico do
                            colaborador!
                        </DialogDescription>
                        <main className="w-full h-full flex items-center justify-center">
                            <ListColaboradoresAtivos tipoSelect/>
                            <ContainerSystem inputsClass="p-5">
                                <div className="flex w-full">
                                    <div>
                                        <img
                                            height={100}
                                            width={100}
                                            src={colaboradorRequest?.infoPessoais.dirFoto!!}
                                            className={"w-[100px] h-[100px]"}
                                            alt="Foto do Colaborador"
                                        />
                                    </div>
                                    <div className=" h-full flex flex-col text-xs px-3">
                                        {colaboradorRequest?.infoPessoais.fkAuth && (
                                            <span>
                        Código de registro:{" "}
                                                {colaboradorRequest?.infoPessoais.fkAuth}
                      </span>
                                        )}
                                        <span>
                      Nome: {colaboradorRequest?.infoPessoais.nomeCompleto}
                    </span>
                                        {colaboradorRequest?.infoPessoais.dataNascimento && (
                                            <span>
                        Idade:{" "}
                                                {new Date().getFullYear() -
                                                    parseInt(
                                                        colaboradorRequest?.infoPessoais.dataNascimento.split(
                                                            "-",
                                                        )[0],
                                                    )}{" "}
                                                anos (
                                                {
                                                    formatarDataComum(
                                                        colaboradorRequest?.infoPessoais.dataNascimento,
                                                    )?.split(" ")[0]
                                                }
                                                )
                      </span>
                                        )}

                                        {colaboradorRequest?.infoPessoais.cpf && (
                                            <span>CPF: {colaboradorRequest?.infoPessoais.cpf}</span>
                                        )}
                                    </div>
                                    <div className="h-full flex flex-col text-xs px-3">
                                        {colaboradorRequest?.infoMEI ? (
                                            <>
                                                {colaboradorRequest?.infoMEI?.dataAdmissao && (
                                                    <span>
                            Data de contratação:{" "}
                                                        {formatarDataComum(
                                                            colaboradorRequest?.infoMEI.dataAdmissao,
                                                        )}
                          </span>
                                                )}
                                                {colaboradorRequest?.infoMEI?.dataDemissao && (
                                                    <span>
                            Data de desligamento:{" "}
                                                        {formatarDataComum(
                                                            colaboradorRequest?.infoMEI.dataDemissao,
                                                        )}
                          </span>
                                                )}
                                                {colaboradorRequest?.infoMEI.empresa?.nome && (
                                                    <span>
                            Empresa: {colaboradorRequest?.infoMEI.empresa.nome}
                          </span>
                                                )}
                                                {colaboradorRequest?.infoMEI.setor?.nome && (
                                                    <span>
                            Setor: {colaboradorRequest?.infoMEI.setor.nome}
                          </span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {colaboradorRequest?.infoCLT &&
                                                !colaboradorRequest?.infoEstagiario?.status ? (
                                                    <>
                                                        {colaboradorRequest?.infoCLT?.dataAdmissao && (
                                                            <span>
                                Data de contratação:{" "}
                                                                {formatarDataComum(
                                                                    colaboradorRequest?.infoCLT.dataAdmissao,
                                                                )}
                              </span>
                                                        )}
                                                        {colaboradorRequest?.infoCLT?.dataDemissao && (
                                                            <span>
                                Data de desligamento:{" "}
                                                                {formatarDataComum(
                                                                    colaboradorRequest?.infoCLT.dataDemissao,
                                                                )}
                              </span>
                                                        )}
                                                        {colaboradorRequest?.infoCLT.empresa?.nome && (
                                                            <span>
                                Empresa:{" "}
                                                                {colaboradorRequest?.infoCLT.empresa.nome}
                              </span>
                                                        )}
                                                        {colaboradorRequest?.infoCLT.setor?.nome && (
                                                            <span>
                                Setor: {colaboradorRequest?.infoCLT.setor.nome}
                              </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {colaboradorRequest?.infoEstagiario
                                                            ?.dataAdmissao && (
                                                            <span>
                                Data de contratação:{" "}
                                                                {
                                                                    colaboradorRequest?.infoEstagiario
                                                                        .dataAdmissao
                                                                }
                              </span>
                                                        )}
                                                        {colaboradorRequest?.infoEstagiario
                                                            ?.dataDemissao && (
                                                            <span>
                                Data de desligamento:{" "}
                                                                {
                                                                    colaboradorRequest?.infoEstagiario
                                                                        .dataDemissao
                                                                }
                              </span>
                                                        )}
                                                        {colaboradorRequest?.infoEstagiario?.empresa
                                                            ?.nome && (
                                                            <span>
                                Empresa:{" "}
                                                                {
                                                                    colaboradorRequest?.infoEstagiario.empresa
                                                                        .nome
                                                                }
                              </span>
                                                        )}
                                                        {colaboradorRequest?.infoEstagiario?.setor
                                                            ?.nome && (
                                                            <span>
                                Setor:{" "}
                                                                {colaboradorRequest?.infoEstagiario.setor.nome}
                              </span>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full h-full flex flex-col justify-center px-40 gap-5">
                                    <LabelInputPadrao.Root
                                        name={"dataInicio"}
                                        title={"Data de inicio"}
                                        width={100}
                                        type={"date"}
                                        change={alterFiltro}
                                        value={filtro.dataInicio}
                                    />
                                    <LabelInputPadrao.Root
                                        name={"dataFim"}
                                        title={"Data final"}
                                        width={100}
                                        type={"date"}
                                        change={alterFiltro}
                                        value={filtro.dataFim}
                                    />
                                    <Button type="button" onClick={() => relatoriosTodos()}>
                                        Relatório - Todos - CLT (Banco de horas)
                                    </Button>
                                    <Button type="button" onClick={() => relatorioSegundaVia()}>
                                        Relatório - Segunda-via - Individual (Banco de horas)
                                    </Button>
                                    <Button type="button" onClick={() => relatorioGeral()}>
                                        Relátorio geral
                                    </Button>
                                </div>

                            </ContainerSystem>

                        </main>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
