import ListColaboradoresAtivos from "@/components/diversos/essential/ListColaboradoresAtivos";
import {
    anotacaoSelectGlobal,
    AnotacaoSelectGlobalProps,
    colaboradorSelectGlobal,
    colaboradorSelectGlobalProps,
    stateLoundingGlobal,
    stateLoundingGlobalProps,
    stateModalAnotacaoCriarGlobal,
    stateModalAnotacaoGlobal,
    stateModalProps,
} from "@/lib/globalStates";
import {
    cn,
    data1MesAtrasInput,
    dataAtualInput,
    formatarDataComum,
} from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import React, {
    ChangeEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {MainContext} from "@/provider/main-provider";
import {AnotacaoRhModels, ResponseFindAnotacaoRhDTO} from "@/lib/models";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {FileArchive, FileText, ImageIcon, Plus, Sheet} from "lucide-react";
import ListAnexos from "@/components/diversos/essential/list-anexos";
import ListAnexosBaixar from "@/components/diversos/essential/list-anexos-baixar";
import Router from "next/router";
import {ScrollArea} from "@/components/ui/scroll-area";

type filtroProps = {
    anotacao: string;
    motivo: string
    tipo: string;
    status: boolean;
    dataInicio: string;
    dataFim: string;
    idColaborador: string;
};

export default function Anotacoes() {
    const queryClient = useQueryClient();
    const {host, configToken, acessos, searchParams} = useContext(MainContext);
    const {colaborador} = colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
        (state: any) => state,
    );
    const {setAnotacao} = anotacaoSelectGlobal<AnotacaoSelectGlobalProps>(
        (state: any) => state,
    );
    const [filtro, setFiltro] = useState<filtroProps>({
        anotacao: "",
        motivo: "",
        tipo: "",
        status: true,
        dataInicio: data1MesAtrasInput(),
        dataFim: dataAtualInput(),
        idColaborador: "",
    });
    const state = stateModalAnotacaoGlobal<stateModalProps>((state) => state);
    const stateModalCriar = stateModalAnotacaoCriarGlobal<stateModalProps>(
        (state) => state,
    );
    const [stateDados, setStateDados] = useState(true);

    const fetchAnotacoes = async (): Promise<
        ResponseFindAnotacaoRhDTO | undefined
    > => {
        try {
            if (!filtro.idColaborador) {
                return;
            }
            const response = await axios
                .get(
                    `${host}/rh/find/anotacao/filter?anotacao=${filtro.anotacao}&motivo=${filtro.motivo}&id=${filtro.idColaborador}&tipo=${filtro.tipo}&status=${filtro.status}&dataInicio=${filtro.dataInicio}&dataFim=${filtro.dataFim}`,
                    configToken,
                )
                .then((response) => {
                    const anotacoes: ResponseFindAnotacaoRhDTO = response.data;
                    anotacoes.anotacoes.reverse();
                    return anotacoes;
                });
            return response;
        } catch (error) {
            return undefined;
        }
    };

    const {data: responseAnotacao, refetch} = useQuery({
        queryKey: ["Anotacoes", filtro],
        queryFn: fetchAnotacoes,
        enabled:
            !!filtro && !!colaborador?.fkAuth && filtro?.tipo !== "" && !!configToken,
    });

    useEffect(() => {
        if (!colaborador) {
            return;
        }
        setFiltro((prevState) => ({
            ...prevState,
            tipo: colaborador?.tipo,
            idColaborador: colaborador.fkAuth.toString()!,
        }));
    }, [colaborador]);

    const alterFiltro = (e: ChangeEvent<any>) => {
        const {name, value} = e.target;
        if (name === "status") {
            setFiltro((prevState: any) => ({
                ...prevState,
                status: value === "true",
            }));
            return;
        }
        setFiltro((prevState: any) => ({...prevState, [name]: value}));
    };

    useEffect(() => {
        refetch();
    }, [filtro, queryClient, colaborador]);


    return (
        <>
            <ModalAnotacaoView refreshNotas={refetch}/>
            <ModalAnotacaoCriar refreshNotas={refetch}/>
            <ListColaboradoresAtivos tipoSelect/>
            <div className="flex flex-col w-full border border-slate-600 relative">
                <>

                    <div
                        className="flex w-full py-3 min-h-[124px] bg-[var(--color-tec)] px-5 border-b border-slate-600">
                        {responseAnotacao?.infoColaborador.infoPessoais.dirFoto! && (
                            <div>
                                <img
                                    src={responseAnotacao?.infoColaborador.infoPessoais.dirFoto!}
                                    className={"w-[100px] h-[100px]"}
                                    alt="Foto do Colaborador"
                                />
                            </div>
                        )}

                        <div className=" h-full flex flex-col text-xs px-3">
                            {responseAnotacao?.infoColaborador.infoPessoais.fkAuth && (
                                <span>
                    Código de registro:{" "}
                                    {responseAnotacao?.infoColaborador.infoPessoais.fkAuth}
                  </span>
                            )}
                            <span>
                  Nome:{" "}
                                {responseAnotacao?.infoColaborador.infoPessoais.nomeCompleto}
                </span>
                            {responseAnotacao?.infoColaborador.infoPessoais
                                .dataNascimento && (
                                <span>
                    Idade:{" "}
                                    {new Date().getFullYear() -
                                        parseInt(
                                            responseAnotacao?.infoColaborador.infoPessoais.dataNascimento.split(
                                                "-",
                                            )[0],
                                        )}{" "}
                                    anos (
                                    {
                                        formatarDataComum(
                                            responseAnotacao?.infoColaborador.infoPessoais
                                                .dataNascimento,
                                        )?.split(" ")[0]
                                    }
                                    )
                  </span>
                            )}

                            {responseAnotacao?.infoColaborador.infoPessoais.cpf && (
                                <span>
                    CPF: {responseAnotacao?.infoColaborador.infoPessoais.cpf}
                  </span>
                            )}
                        </div>
                        <div className="h-full flex flex-col text-xs px-3">
                            {responseAnotacao?.infoColaborador.infoMEI ? (
                                <>
                                    {responseAnotacao.infoColaborador.infoMEI?.dataAdmissao && (
                                        <span>
                        Data de contratação:{" "}
                                            {formatarDataComum(
                                                responseAnotacao.infoColaborador.infoMEI.dataAdmissao,
                                            )}
                      </span>
                                    )}
                                    {responseAnotacao.infoColaborador.infoMEI?.dataDemissao && (
                                        <span>
                        Data de desligamento:{" "}
                                            {formatarDataComum(
                                                responseAnotacao.infoColaborador.infoMEI.dataDemissao,
                                            )}
                      </span>
                                    )}
                                    {responseAnotacao.infoColaborador.infoMEI.empresa?.nome && (
                                        <span>
                        Empresa:{" "}
                                            {responseAnotacao.infoColaborador.infoMEI.empresa.nome}
                      </span>
                                    )}
                                    {responseAnotacao.infoColaborador.infoMEI.setor?.nome && (
                                        <span>
                        Setor:{" "}
                                            {responseAnotacao.infoColaborador.infoMEI.setor.nome}
                      </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    {responseAnotacao?.infoColaborador.infoCLT &&
                                    !responseAnotacao?.infoColaborador.infoEstagiario
                                        ?.status ? (
                                        <>
                                            {responseAnotacao.infoColaborador.infoCLT
                                                ?.dataAdmissao && (
                                                <span>
                            Data de contratação:{" "}
                                                    {formatarDataComum(
                                                        responseAnotacao.infoColaborador.infoCLT
                                                            .dataAdmissao,
                                                    )}
                          </span>
                                            )}
                                            {responseAnotacao.infoColaborador.infoCLT
                                                ?.dataDemissao && (
                                                <span>
                            Data de desligamento:{" "}
                                                    {formatarDataComum(
                                                        responseAnotacao.infoColaborador.infoCLT
                                                            .dataDemissao,
                                                    )}
                          </span>
                                            )}
                                            {responseAnotacao.infoColaborador.infoCLT.empresa
                                                ?.nome && (
                                                <span>
                            Empresa:{" "}
                                                    {
                                                        responseAnotacao.infoColaborador.infoCLT.empresa
                                                            .nome
                                                    }
                          </span>
                                            )}
                                            {responseAnotacao.infoColaborador.infoCLT.setor
                                                ?.nome && (
                                                <span>
                            Setor:{" "}
                                                    {
                                                        responseAnotacao.infoColaborador.infoCLT.setor
                                                            .nome
                                                    }
                          </span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {responseAnotacao?.infoColaborador.infoEstagiario
                                                ?.dataAdmissao && (
                                                <span>
                            Data de contratação:{" "}
                                                    {
                                                        responseAnotacao?.infoColaborador.infoEstagiario
                                                            .dataAdmissao
                                                    }
                          </span>
                                            )}
                                            {responseAnotacao?.infoColaborador.infoEstagiario
                                                ?.dataDemissao && (
                                                <span>
                            Data de desligamento:{" "}
                                                    {
                                                        responseAnotacao?.infoColaborador.infoEstagiario
                                                            .dataDemissao
                                                    }
                          </span>
                                            )}
                                            {responseAnotacao?.infoColaborador.infoEstagiario
                                                ?.empresa?.nome && (
                                                <span>
                            Empresa:{" "}
                                                    {
                                                        responseAnotacao?.infoColaborador.infoEstagiario
                                                            .empresa.nome
                                                    }
                          </span>
                                            )}
                                            {responseAnotacao?.infoColaborador.infoEstagiario?.setor
                                                ?.nome && (
                                                <span>
                            Setor:{" "}
                                                    {
                                                        responseAnotacao?.infoColaborador.infoEstagiario
                                                            .setor.nome
                                                    }
                          </span>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div
                        className="w-full h-full relative overflow-y-auto overflow-x-hidden bg-[var(--color-tec)]">
                        <div className="absolute w-full">
                            <Table className="relative">
                                <TableCaption>...</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hover:bg-[var(--color-tec-hover)] text-black">
                      <span className="flex gap-2 relative items-center justify-between">
                        ID
                      </span>
                                        </TableHead>
                                        <TableHead className="hover:bg-[var(--color-tec-hover)]">
                      <span className="flex gap-2 relative items-center justify-between">
                        <Input
                            onChange={alterFiltro}
                            className="border-none bg-transparent focus-visible:!ring-0 "
                            placeholder="Anotação"
                            type="text"
                            name="anotacao"
                        />
                      </span>
                                        </TableHead>

                                        <TableHead className="hover:bg-[var(--color-tec-hover)]">
                      <span className="flex gap-2 relative items-center justify-between">
                        <select
                            onChange={alterFiltro}
                            className="flex h-10 w-full rounded-md border text-center !border-stone-600 border-Input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-none bg-transparent focus-visible:!ring-0"
                            name="tipo"
                            value={filtro.tipo}
                        >
                          <option value="TODOS">TODOS</option>
                          <option value="CLT">CLT</option>
                          <option value="ESTAGIARIO">ESTAGIARIO</option>
                          <option value="TERCEIRIZADO">TERCEIRIZADO</option>
                        </select>
                      </span>
                                        </TableHead>
                                        <TableHead className=" hover:bg-[var(--color-tec-hover)]">
                      <span className=" flex gap-2 relative items-center justify-between">
                        <select
                            name="motivo"
                            onChange={alterFiltro}
                            className="flex h-10 w-full rounded-md border text-center !border-stone-600 border-Input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-none bg-transparent focus-visible:!ring-0"
                        >
                          <option value="" selected>
                            Motivo
                          </option>
                          <option value="Atestado dias">Atestado dias</option>
                          <option value="Atestado horas">Atestado horas</option>
                          <option value="Ferias">Ferias</option>
                          <option value="Ferias">Faltou</option>
                          <option value="Suspensão">Suspensão</option>
                          <option value="Licença">Licença</option>
                          <option value="Advertência verbal">
                            Advertência verbal
                          </option>
                          <option value="Advertência escrita">
                            Advertência escrita
                          </option>
                          <option value="Atraso">Atraso</option>
                          <option value="Avulsa">Avulsa</option>
                        </select>
                      </span>
                                        </TableHead>
                                        <TableHead className=" hover:bg-[var(--color-tec-hover)]">
                      <span className=" flex gap-2 relative items-center justify-between">
                        <select
                            className=" flex h-10 w-full rounded-md border text-center !border-stone-600 border-Input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-none bg-transparent focus-visible:!ring-0"
                            name="status"
                            onChange={alterFiltro}
                            value={filtro.status ? "true" : "false"}
                        >
                          <option value="true" selected>
                            Ativos
                          </option>
                          <option value="false">Inativos</option>
                        </select>
                      </span>
                                        </TableHead>

                                        <TableHead className="hover:bg-[var(--color-tec-hover)]">
                      <span className="flex gap-2 relative items-center justify-center">
                        <Input
                            onChange={alterFiltro}
                            className="border-none bg-transparent text-center focus-visible:!ring-0 "
                            type="date"
                            name="dataInicio"
                            title={"Data de inicio"}
                            value={filtro.dataInicio}
                        />
                      </span>
                                        </TableHead>
                                        <TableHead className="hover:bg-[var(--color-tec-hover)]">
                      <span className="flex gap-2 relative items-center justify-center">
                        <Input
                            onChange={alterFiltro}
                            className="border-none bg-transparent text-center focus-visible:!ring-0 "
                            type="date"
                            name="dataFim"
                            title={"Data de final"}
                            value={filtro.dataFim}
                        />
                      </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {responseAnotacao?.anotacoes?.map((anotacao) => {
                                        return (
                                            <TableRow
                                                key={anotacao.id}
                                                onClick={() => {
                                                    setAnotacao(anotacao);
                                                    state.alterState();
                                                }}
                                                className={"hover:bg-[var(--color-tec-hover)] cursor-pointer"}
                                            >
                                                <TableCell className="max-w-[200px] overflow-hidden text-ellipsis">
                          <span className=" whitespace-nowrap ">
                            {anotacao.id}
                          </span>
                                                </TableCell>
                                                <TableCell className="max-w-[200px] overflow-hidden text-ellipsis">
                          <span className=" whitespace-nowrap ">
                            {anotacao.anotacao}
                          </span>
                                                </TableCell>
                                                <TableCell>
                          <span className="text-center flex items-center justify-center">
                            {anotacao.tipoAnotacao}
                          </span>
                                                </TableCell>
                                                <TableCell>
                          <span className="text-center flex items-center justify-center">
                            {anotacao.motivo}
                          </span>
                                                </TableCell>
                                                <TableCell>
                          <span className="text-center flex items-center justify-center">
                            {anotacao.status ? "Ativa" : "Inativa"}
                          </span>
                                                </TableCell>
                                                <TableCell>
                          <span className="text-center flex items-center justify-center">
                            {formatarDataComum(anotacao.dataInicio)}
                          </span>
                                                </TableCell>
                                                <TableCell>
                          <span className="text-center flex items-center justify-center">
                            {formatarDataComum(anotacao.dataFinal)}
                          </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        {colaborador?.fkAuth && acessos?.rolesRH.criarNota && (
                            <Button
                                onClick={() => stateModalCriar.alterState()}
                                type="button"
                                className="fixed bottom-5 opacity-80 flex gap-3 group"
                            >
                                <Plus/>
                                <span className="group-hover:block hidden">Nova anotação</span>
                            </Button>
                        )}
                        {responseAnotacao?.dadosContabilizados && (
                            <div
                                className={cn(
                                    "flex  items-end fixed -right-[250px] bottom-5 transition-all opacity-70",
                                    stateDados && "!right-0 opacity-100",
                                )}
                            >
                                <Button
                                    className="relative bottom-0 rounded-l-full"
                                    type="button"
                                    onClick={() => setStateDados(!stateDados)}
                                >
                                    {stateDados ? (
                                        <>Esconder os dados</>
                                    ) : (
                                        <>Visualizar os dados</>
                                    )}
                                </Button>
                                <div
                                    className={cn(
                                        " shadow-2xl rounded-lg dark:bg-[#0b1120] bg-[#ced3de] border w-[250px] ",
                                    )}
                                >
                                    <ul className="text-sm p-3 flex flex-col gap-1">
                                        <li className="flex justify-between">
                                            <span>Advertencia escrita</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.advEscrita!}
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Advertencia verbal</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.advVerbal!}
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Atestado de horas</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.atestadoHora!}
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Atestado de dias</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.atestado!}
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Licença</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.licenca!}
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Ferias</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.ferias!}
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Quantidade de faltas</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.faltou!}
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Quantidade de atrasos</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.atrasos!}
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Quantidade de suspensão</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.suspensao!}
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Tempo de atraso</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.atrasoTempo!} min
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Banco de horas</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.bancoHoras!} min
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Horas positivas</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.horasPositivas!}{" "}
                                                min
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Horas negativas</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.horasNegativas!}{" "}
                                                min
                      </span>
                                        </li>
                                        <hr className="border border-b-stone-400"/>
                                        <li className="flex justify-between">
                                            <span>Horas extras</span>
                                            <span>
                        {responseAnotacao?.dadosContabilizados.horasExtras!} min
                      </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            </div>
        </>
    );
}

export function ModalAnotacaoView({refreshNotas}: { refreshNotas: any }) {
    const queryClient = useQueryClient();
    const state = stateModalAnotacaoGlobal<stateModalProps>((state) => state);
    const {colaborador} = colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
        (state: any) => state,
    );
    const anotacaoSelect = anotacaoSelectGlobal<AnotacaoSelectGlobalProps>(
        (state: any) => state,
    );
    const {register, handleSubmit} = useForm();
    const [anotacao, setAnotacao] = useState<AnotacaoRhModels>();
    const [modo, setModo] = useState(false);
    const [anexoListItens, setAnexoListItens] = useState<File[]>([]);

    const {host, configToken, acessos} = useContext(MainContext);
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const [atraso, setAtraso] = useState<boolean>(false);

    useEffect(() => {
        setAnotacao(anotacaoSelect.anotacao!);
    }, [anotacaoSelect.anotacao]);

    const sendAnotacaoEditada = async () => {
        displayLounding.setDisplayLounding();
        let updatedAnexos: string[] = [];
        if (anexoListItens.length !== 0) {
            try {
                updatedAnexos = await updateFile();
            } catch {
                displayLounding.setDisplayFailure(
                    "Falha na tentativa de enviar os documentos. Tente novamente!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
                displayLounding.setDisplayReset();
                return;
            }
        }

        const anotacaoRequest: AnotacaoRhModels = {
            ...anotacao!,
            anexo:
                updatedAnexos.length === 0
                    ? anotacao?.anexo!
                    : JSON.stringify(updatedAnexos),
        };
        console.log(anotacaoRequest);
        if (
            JSON.stringify(anotacaoSelect.anotacao) ===
            JSON.stringify(anotacaoRequest)
        ) {
            displayLounding.setDisplayFailure("Não houve nenhuma alteração!");
            await new Promise((resolve) => setTimeout(resolve, 1500));
            displayLounding.setDisplayReset();
            setModo(false);
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        await axios
            .put(`${host}/rh/update/anotacao/atualizar`, anotacaoRequest, configToken)
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                setModo(false);
                state.alterState();
                refreshNotas();
                setAnexoListItens([]);
            })
            .catch(async (error) => {
                displayLounding.setDisplayFailure(
                    "Não foi possivel atualizar a anotação",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            });
    };

    const inativarNota = async () => {
        displayLounding.setDisplayLounding();
        await new Promise((resolve) => setTimeout(resolve, 500));
        await axios
            .delete(
                `${host}/rh/update/anotacao/inativar?id=${anotacao?.id}`,
                configToken,
            )
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                setModo(false);
                state.alterState();
                refreshNotas();
            })
            .catch(async (error) => {
                displayLounding.setDisplayFailure(
                    "Não foi possivel inativar a anotação",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            });
    };

    const reativarNota = async () => {
        displayLounding.setDisplayLounding();
        await new Promise((resolve) => setTimeout(resolve, 500));
        await axios
            .get(
                `${host}/rh/update/anotacao/reativar?id=${anotacao?.id}`,
                configToken,
            )
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                setModo(false);
                state.alterState();
                refreshNotas();
            })
            .catch(async (error) => {
                displayLounding.setDisplayFailure(
                    "Não foi possivel inativar a anotação",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            });
    };

    const alterAnotacao = (e: ChangeEvent<any>) => {
        const {name, value} = e.target;
        setAnotacao((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const alterDados = (e: ChangeEvent<any>) => {
        const {name, checked} = e.target;

        setAnotacao((prevState: any) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const updateFile = async () => {
        let updatedAnexos: string[] = [];
        for (const file of anexoListItens) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "dir",
                `C:/GrupoQualityWeb/outv2/assets/rh/doc/${colaborador?.nomeCompleto}`,
            );

            await axios
                .post(`${host}/rh/update/doc`, formData, configToken)
                .then(async (response) => {
                    updatedAnexos.push(
                        `/assets/rh/doc/${colaborador?.nomeCompleto}/${response.data}`,
                    );
                })
                .catch(async () => {
                    throw new Error("Falha ao enviar o arquivo");
                });
        }
        return updatedAnexos;
    };

    return (
        <>
            <Dialog
                open={state.stateModal}
                onOpenChange={() => {
                    setModo(false);
                    state.alterState();
                }}
            >
                <DialogContent className="!max-w-[68rem] scale-[85%] bg-[var(--color-tec)]">
                    <DialogHeader>
                        <DialogTitle>Anotação {anotacao?.id}#</DialogTitle>
                        {modo ? (
                            <form
                                className="border rounded-xl p-3 w-full h-full relative pb-10"
                                onSubmit={handleSubmit(sendAnotacaoEditada)}
                            >
                                <div className=" w-full flex flex-col gap-2">
                                    <div className={cn("flex flex-col gap-4 w-full")}>
                                        <Label htmlFor={"anotacao"}>Ocorrencia</Label>
                                        <Textarea
                                            className="text-xs"
                                            id={"anotacao"}
                                            name={"anotacao"}
                                            required
                                            onChange={alterAnotacao}
                                            value={anotacao?.anotacao}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full h-full py-5">
                                    <div className="text-sm w-[50%] h-full flex flex-col gap-2">
                                        <Label>Dados:</Label>
                                        <ul className="flex gap-2 flex-col py-2">
                                            <li className="flex gap-3 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterDados}
                                                    id="atestado"
                                                    name="atestado"
                                                    checked={anotacao?.atestado}
                                                />
                                                <Label className="text-xs" htmlFor="atestado">
                                                    Atestado de dias
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterDados}
                                                    id="atestadoHora"
                                                    name="atestadoHora"
                                                    checked={anotacao?.atestadoHora}
                                                />
                                                <Label className="text-xs" htmlFor="atestadoHora">
                                                    Atestado de horas
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    id="ferias"
                                                    onChange={alterDados}
                                                    name="ferias"
                                                    checked={anotacao?.ferias}
                                                />
                                                <Label className="text-xs" htmlFor="ferias">
                                                    Ferias
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    id="suspensao"
                                                    name="suspensao"
                                                    onChange={alterDados}
                                                    checked={anotacao?.suspensao}
                                                />
                                                <Label className="text-xs" htmlFor="suspensao">
                                                    Suspensão
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    id="faltou"
                                                    onChange={alterDados}
                                                    name="faltou"
                                                    checked={anotacao?.faltou}
                                                />
                                                <Label className="text-xs" htmlFor="faltou">
                                                    Faltou
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    id="licenca"
                                                    onChange={alterDados}
                                                    name="licenca"
                                                    checked={anotacao?.licenca}
                                                />
                                                <Label className="text-xs" htmlFor="licenca">
                                                    Licença
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    id="advVerbal"
                                                    onChange={alterDados}
                                                    name="advVerbal"
                                                    checked={anotacao?.advVerbal}
                                                />
                                                <Label className="text-xs" htmlFor="advVerbal">
                                                    Advertência verbal
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    id="advEscrita"
                                                    onChange={alterDados}
                                                    name="advEscrita"
                                                    checked={anotacao?.advEscrita}
                                                />
                                                <Label className="text-xs" htmlFor="advEscrita">
                                                    Advertência escrita
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <input
                                                    onClick={() => {
                                                        setAtraso(!atraso);
                                                    }}
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    id="atraso"
                                                    name="atraso"
                                                    onChange={alterDados}
                                                    checked={anotacao?.atraso}
                                                />
                                                <Label className="text-xs" htmlFor="atraso">
                                                    Atraso
                                                </Label>
                                            </li>
                                            <li className="flex gap-2 flex-col">
                                                <div className={cn("flex flex-col gap-4 w-full")}>
                                                    <Label htmlFor={"anotacao"}>Motivo</Label>
                                                    <select
                                                        value={anotacao?.motivo}
                                                        required
                                                        name="motivo"
                                                        onChange={alterAnotacao}
                                                        className="flex h-9 w-[50%] rounded-md border !border-stone-600 border-Input bg-background px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <option value="">Registre um motivo</option>
                                                        <option value="Atestado dias">Atestado dias</option>
                                                        <option value="Atestado horas">
                                                            Atestado horas
                                                        </option>
                                                        <option value="Ferias">Ferias</option>
                                                        <option value="Faltou">Faltou</option>
                                                        <option value="Suspensão">Suspensão</option>
                                                        <option value="Licença">Licença</option>
                                                        <option value="Advertência verbal">
                                                            Advertência verbal
                                                        </option>
                                                        <option value="Advertência escrita">
                                                            Advertência escrita
                                                        </option>
                                                        <option value="Atraso">Atraso</option>
                                                        <option value="Avulsa">Avulsa</option>
                                                    </select>
                                                </div>
                                            </li>
                                            {anotacao?.atraso && (
                                                <li className="flex gap-2 flex-col">
                                                    <LabelInputPadrao.Root
                                                        name="atrasoTempo"
                                                        title={"Tempo de atraso"}
                                                        change={alterAnotacao}
                                                        width={50}
                                                        type="number"
                                                        required
                                                        value={anotacao?.atrasoTempo!.toString()}
                                                    />
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="text-sm w-[50%] h-full flex flex-col gap-2">
                                        <ul className="flex gap-2 flex-col py-2">
                                            <li className="flex gap-2 flex-col">
                                                <LabelInputPadrao.Root
                                                    name="horaExtra"
                                                    title={"Hora extra"}
                                                    change={alterAnotacao}
                                                    width={100}
                                                    type="number"
                                                    value={anotacao?.horaExtra!.toString()}
                                                />
                                            </li>
                                            {!atraso && (
                                                <>
                                                    <li className="flex gap-2 flex-col">
                                                        <LabelInputPadrao.Root
                                                            name="bancoPositivo"
                                                            title={"Banco positivo"}
                                                            change={alterAnotacao}
                                                            width={100}
                                                            type="number"
                                                            value={anotacao?.bancoPositivo!.toString()}
                                                        />
                                                    </li>
                                                    <li className="flex gap-2 flex-col">
                                                        <LabelInputPadrao.Root
                                                            name="bancoNegativo"
                                                            title={"Banco negativo"}
                                                            change={alterAnotacao}
                                                            width={100}
                                                            type="number"
                                                            value={anotacao?.bancoNegativo!.toString()}
                                                        />
                                                    </li>
                                                </>
                                            )}
                                            <li className="flex gap-2">
                                                <LabelInputPadrao.Root
                                                    name="dataInicio"
                                                    title={"Data de inicio"}
                                                    change={alterAnotacao}
                                                    width={50}
                                                    type="date"
                                                    required
                                                    value={anotacao?.dataInicio}
                                                />
                                                <LabelInputPadrao.Root
                                                    name="dataFinal"
                                                    title={"Data de final"}
                                                    change={alterAnotacao}
                                                    width={50}
                                                    type="date"
                                                    required
                                                    value={anotacao?.dataFinal}
                                                />
                                            </li>
                                            {anotacao?.advEscrita && (
                                                <li className="flex gap-2 flex-col">
                                                    <LabelInputPadrao.Root
                                                        name="advEscritaData"
                                                        title={"Data da adv escrita"}
                                                        change={alterAnotacao}
                                                        width={100}
                                                        type="date"
                                                        required
                                                        value={anotacao?.advEscritaData}
                                                    />
                                                </li>
                                            )}
                                        </ul>
                                        {(anotacao?.atestado ||
                                            anotacao?.atestadoHora ||
                                            anotacao?.advEscrita ||
                                            anotacao?.licenca) && (
                                            <ListAnexos
                                                list={anexoListItens}
                                                alterList={setAnexoListItens}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-2">
                                    <Button variant="destructive">Enviar edição</Button>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            if (
                                                JSON.stringify(anotacaoSelect.anotacao) !==
                                                JSON.stringify(anotacao)
                                            ) {
                                                setAnotacao(anotacaoSelect.anotacao!);
                                            }
                                            setModo(false);
                                        }}
                                    >
                                        Cancelar edição
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="border rounded-xl p-3 w-full h-full relative flex flex-col gap-5 pb-20">
                                <div className=" w-full flex flex-col gap-2">
                                    <Label className="text-sm">Ocorrencia:</Label>
                                    <span className="text-xs">{anotacao?.anotacao}</span>
                                </div>
                                <div className="flex w-full h-full">
                                    <div className="text-sm w-[50%] h-full flex flex-col gap-2">
                                        <Label>Dados:</Label>
                                        <ul className="flex gap-2 flex-col py-2">
                                            <li className="flex gap-3 items-center">
                                                <Input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    name="atestado"
                                                    id="atestado"
                                                    checked={anotacao?.atestado}
                                                />
                                                <Label className="text-xs" htmlFor="atestado">
                                                    Atestado de dias
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <Input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    name="atestadoHora"
                                                    id="atestadoHora"
                                                    checked={anotacao?.atestadoHora}
                                                />
                                                <Label className="text-xs" htmlFor="atestadoHora">
                                                    Atestado de horas
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <Input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    name="ferias"
                                                    id="ferias"
                                                    checked={anotacao?.ferias}
                                                />
                                                <Label className="text-xs" htmlFor="ferias">
                                                    Ferias
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <Input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    name="suspensao"
                                                    id="suspensao"
                                                    checked={anotacao?.suspensao}
                                                />
                                                <Label className="text-xs" htmlFor="suspensao">
                                                    Suspensão
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <Input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    name="licenca"
                                                    id="licenca"
                                                    checked={anotacao?.licenca}
                                                />
                                                <Label className="text-xs" htmlFor="licenca">
                                                    Licença
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <Input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    name="advVerbal"
                                                    id="advVerbal"
                                                    checked={anotacao?.advVerbal}
                                                />
                                                <Label className="text-xs" htmlFor="advVerbal">
                                                    Advertência verbal
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <Input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    name="advEscrita"
                                                    id="advEscrita"
                                                    checked={anotacao?.advEscrita}
                                                />
                                                <Label className="text-xs" htmlFor="advEscrita">
                                                    Advertência escrita
                                                </Label>
                                            </li>
                                            <li className="flex gap-3 items-center">
                                                <Input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    name="atraso"
                                                    id="atraso"
                                                    checked={anotacao?.atraso}
                                                />
                                                <Label className="text-xs" htmlFor="atraso">
                                                    Atraso
                                                </Label>
                                            </li>
                                            {anotacao?.advEscrita && (
                                                <li className="flex gap-2 items-center">
                                                    <Label htmlFor="dataFinal">
                                                        Data da adv. escrita:
                                                    </Label>
                                                    <span className="text-xs">
                            {formatarDataComum(anotacao?.advEscritaData)}
                          </span>
                                                </li>
                                            )}
                                            {anotacao?.atraso && (
                                                <li className="flex gap-2 items-center">
                                                    <Label htmlFor="dataFinal">Tempo de atraso:</Label>
                                                    <span className="text-xs">
                            {anotacao?.atrasoTempo} min
                          </span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="text-sm w-[50%] h-full flex flex-col gap-2">
                                        <Label>Informações:</Label>
                                        <ul className="flex gap-2 flex-col py-2">
                                            {(anotacao?.horaExtra || anotacao?.horaExtra! > 0) && (
                                                <li className="flex gap-2 items-center">
                                                    <Label htmlFor="horaExtra">Hora extra:</Label>
                                                    <span className="text-xs">
                            {anotacao?.horaExtra} min
                          </span>
                                                </li>
                                            )}
                                            {(anotacao?.bancoPositivo ||
                                                anotacao?.bancoPositivo! > 0) && (
                                                <li className="flex gap-2 items-center">
                                                    <Label htmlFor="bancoPositivo">Banco positivo:</Label>
                                                    <span className="text-xs">
                            {anotacao?.bancoPositivo} min
                          </span>
                                                </li>
                                            )}
                                            {(anotacao?.bancoNegativo ||
                                                anotacao?.bancoNegativo! > 0) && (
                                                <li className="flex gap-2 items-center">
                                                    <Label htmlFor="bancoNegativo">Banco negativo:</Label>
                                                    <span className="text-xs">
                            {anotacao?.bancoNegativo} min
                          </span>
                                                </li>
                                            )}

                                            <li className="flex gap-2 items-center">
                                                <Label htmlFor="dataInicio">Data de inicio:</Label>
                                                <span className="text-xs">
                          {formatarDataComum(anotacao?.dataInicio)}
                        </span>
                                            </li>
                                            <li className="flex gap-2 items-center">
                                                <Label htmlFor="dataFinal">Data de final:</Label>
                                                <span className="text-xs">
                          {formatarDataComum(anotacao?.dataFinal)}
                        </span>
                                            </li>
                                        </ul>
                                        {anotacao?.anexo && anotacao?.anexo!.length > 0 && (
                                            <AnexoBaixarAnotacao
                                                anexos={JSON.parse(anotacao.anexo!)}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-2">
                                    {acessos?.rolesRH.editarNota && (
                                        <Button onClick={() => setModo(true)}>
                                            Editar Anotação
                                        </Button>
                                    )}
                                    {acessos?.rolesRH.inativarNota && (
                                        <>
                                            {!anotacao?.status ? (
                                                <Button variant="link" onClick={() => reativarNota()}>
                                                    Reativar anotação
                                                </Button>
                                            ) : (
                                                <Button variant="link" onClick={() => inativarNota()}>
                                                    Inativar anotação
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function ModalAnotacaoCriar({refreshNotas}: { refreshNotas: any }) {
    const stateModalCriar = stateModalAnotacaoCriarGlobal<stateModalProps>(
        (state) => state,
    );
    const {colaborador} = colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
        (state: any) => state,
    );
    const {register, handleSubmit, getValues, reset} = useForm();
    const [anexoListItens, setAnexoListItens] = useState<File[]>([]);

    const {host, configToken, user} = useContext(MainContext);
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const [atraso, setAtraso] = useState<boolean>(false);

    const sendAnotacaoEditada = async (data: any) => {
        displayLounding.setDisplayLounding();
        let updatedAnexos: string[] = [];
        if (anexoListItens.length !== 0) {
            try {
                updatedAnexos = await updateFile();
            } catch {
                displayLounding.setDisplayFailure(
                    "Falha na tentativa de enviar os documentos. Tente novamente!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                return;
            }
        }
        const anotacaoRequest: AnotacaoRhModels = {
            ...data!,
            responsavel: user?.fkAuth,
            colaboradorReferent: colaborador?.fkAuth,
            anexo: updatedAnexos.length === 0 ? null : JSON.stringify(updatedAnexos),
            tipoAnotacao: colaborador?.tipo,
            horaExtra: data.horaExtra ? data.horaExtra : 0,
            bancoPositivo: data.bancoPositivo ? data.bancoPositivo : 0,
            bancoNegativo: data.bancoNegativo ? data.bancoNegativo : 0,
            atrasoTempo: data.atrasoTempo ? data.atrasoTempo : 0,
        };
        await new Promise((resolve) => setTimeout(resolve, 500));
        await axios
            .post(`${host}/rh/create/anotacao`, anotacaoRequest, configToken)
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset();
                refreshNotas();
                stateModalCriar.alterState();
                reset();
                setAnexoListItens([]);
            })
            .catch(async (error) => {
                displayLounding.setDisplayFailure(error.response?.data);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset();
            });
    };

    const updateFile = async () => {
        let updatedAnexos: string[] = [];
        for (const file of anexoListItens) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "dir",
                `C:/GrupoQualityWeb/outv2/assets/rh/doc/${colaborador?.nomeCompleto}`,
            );

            await axios
                .post(`${host}/rh/update/doc`, formData, configToken)
                .then(async (response) => {
                    updatedAnexos.push(
                        `/assets/rh/doc/${colaborador?.nomeCompleto}/${response.data}`,
                    );
                })
                .catch(async () => {
                    throw new Error("Falha ao enviar o arquivo");
                });
        }
        return updatedAnexos;
    };

    return (
        <>
            <Dialog
                open={stateModalCriar.stateModal}
                onOpenChange={() => {
                    reset();
                    stateModalCriar.alterState();
                }}
            >
                <DialogContent className="!max-w-[68rem] scale-[85%] bg-[var(--color-tec)]">
                    <DialogHeader>
                        <DialogTitle>Nova anotação</DialogTitle>
                        <form
                            className="border rounded-xl p-3 w-full h-full relative pb-10"
                            onSubmit={handleSubmit(sendAnotacaoEditada)}
                        >
                            <div className=" w-full flex flex-col gap-2">
                                <div className={cn("flex flex-col gap-4 w-full")}>
                                    <Label htmlFor={"anotacao"}>Ocorrencia</Label>
                                    <Textarea
                                        className="text-xs"
                                        id={"anotacao"}
                                        {...register("anotacao")}
                                        required
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full h-full py-5">
                                <div className="text-sm w-[50%] h-full flex flex-col gap-2">
                                    <Label>Dados:</Label>
                                    <ul className="flex gap-2 flex-col py-2">
                                        <li className="flex gap-3 items-center">
                                            <input
                                                type="checkbox"
                                                className="checked:w-4 checked:h-4 w-4 h-4"
                                                id="atestado"
                                                {...register("atestado")}
                                            />
                                            <Label className="text-xs" htmlFor="atestado">
                                                Atestado de dias
                                            </Label>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <Input
                                                type="checkbox"
                                                className="checked:w-4 checked:h-4 w-4 h-4"
                                                {...register("atestadoHora")}
                                                id="atestadoHora"
                                                name="atestadoHora"
                                            />
                                            <Label className="text-xs" htmlFor="atestadoHora">
                                                Atestado de horas
                                            </Label>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <input
                                                type="checkbox"
                                                className="checked:w-4 checked:h-4 w-4 h-4"
                                                id="ferias"
                                                {...register("ferias")}
                                                name="ferias"
                                            />
                                            <Label className="text-xs" htmlFor="ferias">
                                                Ferias
                                            </Label>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <input
                                                type="checkbox"
                                                className="checked:w-4 checked:h-4 w-4 h-4"
                                                id="suspensao"
                                                {...register("suspensao")}
                                            />
                                            <Label className="text-xs" htmlFor="suspensao">
                                                Suspensão
                                            </Label>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <input
                                                type="checkbox"
                                                className="checked:w-4 checked:h-4 w-4 h-4"
                                                id="faltou"
                                                {...register("faltou")}
                                            />
                                            <Label className="text-xs" htmlFor="faltou">
                                                Faltou
                                            </Label>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <input
                                                type="checkbox"
                                                className="checked:w-4 checked:h-4 w-4 h-4"
                                                id="licenca"
                                                {...register("licenca")}
                                            />
                                            <Label className="text-xs" htmlFor="licenca">
                                                Licença
                                            </Label>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <input
                                                type="checkbox"
                                                className="checked:w-4 checked:h-4 w-4 h-4"
                                                id="advVerbal"
                                                {...register("advVerbal")}
                                                name="advVerbal"
                                            />
                                            <Label className="text-xs" htmlFor="advVerbal">
                                                Advertência verbal
                                            </Label>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <input
                                                type="checkbox"
                                                className="checked:w-4 checked:h-4 w-4 h-4"
                                                id="advEscrita"
                                                {...register("advEscrita")}
                                            />
                                            <Label className="text-xs" htmlFor="advEscrita">
                                                Advertência escrita
                                            </Label>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <input
                                                onClick={() => {
                                                    setAtraso(!atraso);
                                                }}
                                                type="checkbox"
                                                className="checked:w-4 checked:h-4 w-4 h-4"
                                                id="atraso"
                                                {...register("atraso")}
                                            />
                                            <Label className="text-xs" htmlFor="atraso">
                                                Atraso
                                            </Label>
                                        </li>
                                        <li className="flex gap-2 flex-col">
                                            <div className={cn("flex flex-col gap-4 w-full")}>
                                                <Label htmlFor={"anotacao"}>Motivo</Label>
                                                <select
                                                    {...register("motivo")}
                                                    required
                                                    className="flex h-9 w-[50%] rounded-md border !border-stone-600 border-Input bg-background px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Registre um motivo</option>
                                                    <option value="Atestado dias">Atestado dias</option>
                                                    <option value="Atestado horas">Atestado horas</option>
                                                    <option value="Ferias">Ferias</option>
                                                    <option value="Ferias">Faltou</option>
                                                    <option value="Suspensão">Suspensão</option>
                                                    <option value="Licença">Licença</option>
                                                    <option value="Advertência verbal">
                                                        Advertência verbal
                                                    </option>
                                                    <option value="Advertência escrita">
                                                        Advertência escrita
                                                    </option>
                                                    <option value="Atraso">Atraso</option>
                                                    <option value="Avulsa">Avulsa</option>
                                                </select>
                                            </div>
                                        </li>

                                        <li className="flex gap-2 flex-col">
                                            <LabelInputPadrao.Root
                                                name="atrasoTempo"
                                                title={"Tempo de atraso"}
                                                width={50}
                                                register={register}
                                                type="number"
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="text-sm w-[50%] h-full flex flex-col gap-2">
                                    <ul className="flex gap-2 flex-col py-2">
                                        <li className="flex gap-2 flex-col">
                                            <LabelInputPadrao.Root
                                                name="horaExtra"
                                                title={"Hora extra"}
                                                width={100}
                                                register={register}
                                                type="number"
                                            />
                                        </li>

                                        <li className="flex gap-2">
                                            <LabelInputPadrao.Root
                                                name="dataInicio"
                                                title={"Data de inicio"}
                                                width={50}
                                                register={register}
                                                type="date"
                                                required
                                            />
                                            <LabelInputPadrao.Root
                                                name="dataFinal"
                                                title={"Data de final"}
                                                width={50}
                                                register={register}
                                                type="date"
                                                required
                                            />
                                        </li>
                                        {!atraso && (
                                            <>
                                                <li className="flex gap-2 flex-col">
                                                    <LabelInputPadrao.Root
                                                        name="bancoPositivo"
                                                        title={"Banco positivo"}
                                                        width={100}
                                                        register={register}
                                                        type="number"
                                                    />
                                                </li>
                                                <li className="flex gap-2 flex-col">
                                                    <LabelInputPadrao.Root
                                                        name="bancoNegativo"
                                                        title={"Banco negativo"}
                                                        width={100}
                                                        register={register}
                                                        type="number"
                                                    />
                                                </li>
                                            </>
                                        )}

                                        <li className="flex gap-2 flex-col">
                                            <LabelInputPadrao.Root
                                                name="advEscritaData"
                                                title={"Data da adv escrita"}
                                                width={100}
                                                register={register}
                                                type="date"
                                            />
                                        </li>
                                    </ul>

                                    <ListAnexos
                                        list={anexoListItens}
                                        alterList={setAnexoListItens}
                                    />
                                </div>
                            </div>
                            <div className="absolute bottom-2">
                                <Button variant="default">Criar edição</Button>
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        reset();
                                        stateModalCriar.alterState();
                                    }}
                                >
                                    Cancelar edição
                                </Button>
                            </div>
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function AnexoBaixarAnotacao({anexos}: { anexos: string[] }) {
    const {host, configToken} = useContext(MainContext);
    const displayLounding = stateLoundingGlobal((state: any) => state);

    return (
        <div
            className={cn(
                "border h-[80px] w-full rounded-sm border-stone-500 p-2 overflow-x-auto overflow-y-hidden relative",
            )}
        >
            <div className="h-full flex gap-2 absolute">
                {anexos.map((anexo, i) => {
                    const extencaoFile = anexo
                        .split(".")
                        [anexo.split(".").length - 1].toUpperCase();
                    const fileName = anexo.split("/")[anexo.split("/").length - 1];
                    return (
                        <a
                            key={i}
                            onClick={async () => {
                                displayLounding.setDisplayLounding();
                                await axios
                                    .get(`${host}/rh/find/download/arquivo?name=${anexo}`)
                                    .then(() => {
                                        displayLounding.setDisplaySuccess("Baixado");
                                        Router.push(
                                            `${host}/rh/find/download/arquivo?name=${anexo}`,
                                        );
                                        displayLounding.setDisplayReset();
                                    })
                                    .catch(async () => {
                                        displayLounding.setDisplayFailure(
                                            "Este documento já não existe mais!",
                                        );
                                        await new Promise((resolve) => setTimeout(resolve, 2000));
                                        displayLounding.setDisplayReset();
                                    });
                            }}
                            title={fileName}
                            target="_blank"
                            className="border border-stone-500 h-[65px] w-[65px] flex flex-col items-center justify-center flex-none rounded-md cursor-pointer hover:bg-[var(--color-tec-hover)]"
                        >
                            {(extencaoFile === "CSV" || extencaoFile === "XLSX") && (
                                <Sheet className="w-4"/>
                            )}
                            {(extencaoFile === "PNG" ||
                                extencaoFile === "JPEG" ||
                                extencaoFile === "JPG") && <ImageIcon className="w-4"/>}
                            {(extencaoFile === "TXT" || extencaoFile === "DOCX") && (
                                <FileText className="w-4"/>
                            )}
                            {(extencaoFile === "ZIP" || extencaoFile === "RAR") && (
                                <FileArchive className="w-4"/>
                            )}
                            <span className="text-xs">{extencaoFile}</span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
