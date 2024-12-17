import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import ContainerMain from "@/components/container/container-main";
import NavBarMain from "@/components/navbar/nav-bar-main";
import {
    solicitacaoSelectGlobal,
    solicitacaoSelectGlobalProps,
    stateItensSolicitacaoEstoqueGlobal,
    stateLoundingGlobal,
    stateLoundingGlobalProps,
    stateModalClassificarTicketGlobal,
    stateModalDeletarTicketGlobal,
    stateModalFinalizarSolicitacaoEstoqueGlobal,
    stateModalProps,
    stateModalReClassificarTicketGlobal,
    stateModalSelecionarItemEstoqueGlobal
} from "@/lib/globalStates";
import {MainContext} from "@/provider/main-provider";
import {useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {
    CategoriaClassificacaoTiModels, GrupoClassificacaoTiModels,
    InfoColaboradorCompletoDTO, ItemSolicitadoEstoqueModel,
    RequestMensagemTiDTO,
    ResponseSocketSolicitacaoTiDTO, SolicitacaoItensEstoqueDTO,
    SolicitcaoTiDTO, SubcategoriaTiModels
} from "@/lib/models";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {alterNomeCompletoParaNomeSobrenome, cn, formatDateTimeUser} from "@/lib/utils";
import {Check, Minus, Paperclip, Plus, RefreshCcw, SendHorizonal, Trash} from "lucide-react";
import ListAnexosBaixar from "@/components/diversos/essential/list-anexos-baixar";
import {useForm} from "react-hook-form";

import ListAnexos from "@/components/diversos/essential/list-anexos";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import {Label} from "@/components/ui/label";

export default function Suporte() {
    return (
        <ContainerMain inputsClass="flex" navBar={<NavBarMain buttonBack/>}>
            <TicketsRoot/>
            <ModalReClassificarTicket/>
            <ModalClassificarTicket/>
        </ContainerMain>
    );
}


function TicketsRoot() {
    return (
        <>
            <TicketsChamados/>
            <TicketsSolicitacao/>
        </>
    );
}

function TicketsChamados() {

    const queryClient = useQueryClient();
    const {acessos, user, host, configToken} = useContext(MainContext)
    const selectSolicitacao = solicitacaoSelectGlobal<solicitacaoSelectGlobalProps>((state: any) => state)
    const {data: solicitacoes} = useQuery({
        queryKey: ["lista_solicitacoes"],
        queryFn: async () => {
            if (acessos?.rolesTI?.delegado && acessos?.rolesTI && acessos) return await axios.get(`${host}/suporte/find/solicitacao`, configToken).then((response) => {
                const solicitacoes: SolicitcaoTiDTO[] = response.data
                return solicitacoes.map((item, i) => {
                    if (selectSolicitacao.solicitacaoSelect) {
                        if (item.id === selectSolicitacao.solicitacaoSelect.id) {
                            item.select = true
                        } else {
                            item.select = false
                        }
                    }
                    return item
                })
            })
            else return await axios.get(`${host}/suporte/find/solicitacao/by?id=${user?.fkAuth!}`, configToken).then((response) => {
                const solicitacoes: SolicitcaoTiDTO[] = response.data
                return solicitacoes.map((item, i) => {
                    if (selectSolicitacao.solicitacaoSelect) {
                        if (item.id === selectSolicitacao.solicitacaoSelect.id) {
                            item.select = true
                        } else {
                            item.select = false
                        }
                    }
                    return item
                })
            })
        },
        refetchInterval: 2000,
        refetchIntervalInBackground: true,
        enabled: !!acessos && !!configToken
    })

    const joinSolicitacao = async (idSolicitacao: number | undefined) => {
        queryClient.setQueryData(["lista_solicitacoes"], (input: any) => {
            return solicitacoes!.map((item, i) => {
                if (item.id === idSolicitacao) {
                    item.select = true
                } else {
                    item.select = false
                }
                return item
            })
        })
        await axios.get(`${host}/suporte/find/solicitacao/exatc?id=${idSolicitacao}`, configToken).then((response) => {
            const solicitacaoSelect: ResponseSocketSolicitacaoTiDTO = response.data
            selectSolicitacao.setSelect(solicitacaoSelect);
        })
    }


    return (
        <div
            className="h-full w-[20%]  shadow-lg bg-[--color-tec] border-l-2 border-y-2 border-slate-600 dark:border-slate-600">
            <div
                className="flex justify-between px-5 items-center w-full h-[10%] bg-[--color-tec] border-b-2 border-slate-600 dark:border-slate-600">
                <span className="text-xs text-black dark:text-white font-medium">Solicitações</span>
            </div>
            <div className=" w-full h-[90%] ">
                <div className="w-full h-full relative overflow-y-scroll scrowInvivel">
                    <div className="absolute  flex flex-col w-full">
                        {solicitacoes?.sort((a: any, b: any) => a.id - b.id
                        ).map((solicitacao: SolicitcaoTiDTO, i: number) => {
                            return (
                                <button key={i}
                                        onClick={() => joinSolicitacao(solicitacao.id)}
                                        className={cn("bg-[--color-tec] px-2 h-[80px] relative flex items-center text-black dark:text-white font-medium justify-between transition-all w-full border-slate-600 dark:border-slate-600 border-b-2", solicitacao.select && "outline  outline-offset-[-4px]")}

                                >
                                    <Avatar>
                                        <AvatarImage
                                            src={!solicitacao.solicitante.infoPessoais.dirFoto ? 'https://placehold.co/600?text=Foto' : solicitacao.solicitante.infoPessoais.dirFoto}
                                            alt="fotoColaborador"/>
                                    </Avatar>
                                    <span
                                        className="text-xs text-black dark:text-white font-medium whitespace-nowrap">{alterNomeCompletoParaNomeSobrenome(solicitacao.solicitante.infoPessoais.nomeCompleto)}</span>
                                    <span
                                        className="smallSpan text-black dark:text-white font-medium absolute right-2 top-1">{formatDateTimeUser(solicitacao.dataHora)}</span>
                                    <span
                                        className="smallSpan text-black dark:text-white font-medium absolute right-2 bottom-1">#{solicitacao.id}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TicketsSolicitacao() {
    const stateModalClassificar =
        stateModalClassificarTicketGlobal<stateModalProps>((state) => state);
    const stateModalReClassificar =
        stateModalReClassificarTicketGlobal<stateModalProps>((state) => state);
    const stateModalDeletarTicket =
        stateModalDeletarTicketGlobal<stateModalProps>((state) => state);
    const [showButton, setShowButton] = useState(false);
    const selectSolicitacao =
        solicitacaoSelectGlobal<solicitacaoSelectGlobalProps>(
            (state: any) => state,
        );
    const {host, user, acessos, configToken} = useContext(MainContext);
    const refDivMensagens = useRef<any>();
    const [setor, setSetor] = useState<string>();
    const {data} = useQuery({
        queryKey: ["mensagens"],
        queryFn: async () => {
            if (!selectSolicitacao.solicitacaoSelect) {
                return undefined;
            }
            await axios
                .get(
                    `${host}/suporte/find/solicitacao/exatc?id=${selectSolicitacao.solicitacaoSelect.id}`,
                    configToken,
                )
                .then((response) => {
                    const solicitacaoSelect: ResponseSocketSolicitacaoTiDTO =
                        response.data;
                    selectSolicitacao.setSelect(solicitacaoSelect);
                })
                .catch(() => {
                    selectSolicitacao.setSelect(null);
                });
        },
        refetchInterval: 2000,
        refetchIntervalInBackground: false,
    });

    const handleScroll = () => {
        if (refDivMensagens.current) {
            const {scrollTop, scrollHeight, clientHeight} = refDivMensagens.current;
            const isScrolledUp =
                (scrollTop * scrollHeight) / 100 < (scrollHeight * 110) / 100;
            setShowButton(isScrolledUp);
        }
    };

    useEffect(() => {
        if (refDivMensagens.current) {
            refDivMensagens.current?.addEventListener("scroll", handleScroll);
            return () => {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                refDivMensagens.current?.removeEventListener("scroll", handleScroll);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refDivMensagens.current]);

    useEffect(() => {
        if (!refDivMensagens.current) return;
        refDivMensagens.current.scrollTop = 100000;
    }, [selectSolicitacao.mensagens?.length]);

    useEffect(() => {
        switch (
            selectSolicitacao?.solicitacaoSelect?.solicitante.infoPessoais.tipo
            ) {
            case "TERCEIRIZADO":
                setSetor(
                    selectSolicitacao?.solicitacaoSelect?.solicitante.infoMEI.setor.nome,
                );
                break;
            case "CLT":
                setSetor(
                    selectSolicitacao?.solicitacaoSelect?.solicitante.infoCLT.setor.nome,
                );
                break;
            case "ESTAGIARIO":
                setSetor(
                    selectSolicitacao?.solicitacaoSelect?.solicitante.infoEstagiario.setor
                        .nome,
                );
                break;
        }
    }, [selectSolicitacao]);

    const getSetorColaborador = (solicitante: InfoColaboradorCompletoDTO) => {
        switch (solicitante.infoPessoais.tipo) {
            case "CLT":
                return solicitante.infoCLT.setor.nome
            case "TERCEIRIZADO":
                return solicitante.infoMEI.setor.nome
            case "ESTAGIARIO":
                return solicitante.infoEstagiario.setor.nome

        }
    }

    // @ts-ignore
    return (
        <div
            className={cn("w-[80%] h-full  border-x-2 border-t-2 border-slate-600 dark:border-slate-600 ")}>
            {selectSolicitacao.solicitacaoSelect && (
                <>
                    <header
                        className={cn("w-full h-[10%] gap-5 bg-[--color-tec] border-b-2 border-slate-600 dark:border-slate-600 flex items-center justify-between px-5")}>
                        <div className="flex items-center justify-start gap-5">
                            <Avatar>
                                <AvatarImage
                                    src={
                                        !selectSolicitacao.solicitacaoSelect.solicitante
                                            .infoPessoais.dirFoto
                                            ? "https://placehold.co/600?text=Foto"
                                            : selectSolicitacao.solicitacaoSelect.solicitante
                                                .infoPessoais.dirFoto
                                    }
                                    alt="fotoColaborador"
                                />
                            </Avatar>
                            <div className={"flex flex-col text-xs gap-2"}>
                            <span>

                            {alterNomeCompletoParaNomeSobrenome(selectSolicitacao.solicitacaoSelect.solicitante.infoPessoais.nomeCompleto)}
                            </span>
                                <span>
                                {getSetorColaborador(selectSolicitacao.solicitacaoSelect.solicitante)}
                            </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {selectSolicitacao.solicitacaoSelect.status === "PENDENTE" && (
                                <Button title={"Deletar"} onClick={() => {
                                    stateModalDeletarTicket.alterState()
                                }} variant="destructive" className="rounded-full w-10 h-10 relative">
                                    <Trash className="w-5 absolute"/>
                                </Button>
                            )}

                            {selectSolicitacao.solicitacaoSelect.status === "PENDENTE" ? (
                                <Button title={"Finalizar"} onClick={() => {
                                    stateModalClassificar.alterState()
                                }} className="rounded-full w-10 h-10 relative">
                                    <Check className="w-5 absolute"/>
                                </Button>
                            ) : (
                                <Button title="Reclassificar" onClick={() => {
                                    stateModalReClassificar.alterState()
                                }} className="rounded-full w-10 h-10 relative">
                                    <RefreshCcw className="w-5 absolute"/>
                                </Button>
                            )}
                        </div>
                    </header>
                    <div
                        className={cn("w-full h-[90%]  relative flex-col flex justify-end")}>
                        <div className="w-full p-5  overflow-auto scrowInvivel" ref={refDivMensagens}>
                            <div className="flex gap-6 flex-col w-full relative">
                                <div
                                    className={cn("flex gap-5 w-full", selectSolicitacao.solicitacaoSelect.solicitante.infoPessoais.fkAuth !== user?.fkAuth! ? "justify-end" : "justify-start")}>

                                    {selectSolicitacao.solicitacaoSelect.solicitante.infoPessoais.fkAuth !== user?.fkAuth ? (


                                        <div
                                            className={cn("flex gap-5 w-full", "justify-start")}>

                                            <div>
                                                <Avatar>
                                                    <AvatarImage
                                                        src={
                                                            !selectSolicitacao.solicitacaoSelect.solicitante.infoPessoais.dirFoto
                                                                ? "https://placehold.co/600?text=Foto"
                                                                : selectSolicitacao.solicitacaoSelect.solicitante.infoPessoais.dirFoto
                                                        }
                                                        alt="fotoColaborador"
                                                    />
                                                </Avatar>
                                            </div>
                                            <div
                                                className="w-[50%] p-5 bg-[--color-tec] rounded-xl relative flex flex-col gap-3">
                                                <h3 className="uppercase">
                                                    {selectSolicitacao.solicitacaoSelect?.titulo}
                                                </h3>
                                                <span className="text-sm"
                                                      dangerouslySetInnerHTML={{__html: selectSolicitacao.solicitacaoSelect.ocorrencia}}>

                                                </span>
                                                <span className="smallSpan absolute right-4 bottom-1">
                                                                {selectSolicitacao.solicitacaoSelect.dataHora!.split("T")[1]}
                                                            </span>
                                                {selectSolicitacao.solicitacaoSelect.anexo && (
                                                    <ListAnexosBaixar
                                                        list={JSON.parse(selectSolicitacao.solicitacaoSelect.anexo)}/>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={cn("flex gap-5 w-full", "justify-end")}>

                                            <div
                                                className="w-[50%] p-5 bg-[--color-tec] rounded-xl relative flex flex-col gap-3">
                                                <h3 className="uppercase">
                                                    {selectSolicitacao.solicitacaoSelect?.titulo}
                                                </h3>
                                                <span className="text-sm"
                                                      dangerouslySetInnerHTML={{__html: selectSolicitacao.solicitacaoSelect.ocorrencia}}>
                                                </span>

                                                <span className="smallSpan absolute right-4 bottom-1">
                                                                {selectSolicitacao.solicitacaoSelect.dataHora!.split("T")[1]}
                                                            </span>
                                                {selectSolicitacao.solicitacaoSelect.anexo && (
                                                    <ListAnexosBaixar
                                                        list={JSON.parse(selectSolicitacao.solicitacaoSelect.anexo)}/>
                                                )}
                                            </div>
                                            <div>
                                                <Avatar>
                                                    <AvatarImage
                                                        src={
                                                            !selectSolicitacao.solicitacaoSelect.solicitante.infoPessoais.dirFoto
                                                                ? "https://placehold.co/600?text=Foto"
                                                                : selectSolicitacao.solicitacaoSelect.solicitante.infoPessoais.dirFoto
                                                        }
                                                        alt="fotoColaborador"
                                                    />
                                                </Avatar>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {selectSolicitacao.mensagens!.map((mensagem, i) => {
                                    return (

                                        <div key={i}
                                             className={cn("flex gap-5 w-full", mensagem.responsavel.fkAuth !== user?.fkAuth! ? "justify-start" : "justify-end")}>
                                            {
                                                mensagem.responsavel.fkAuth !== user?.fkAuth! ? (
                                                    <>
                                                        <div>
                                                            <Avatar>
                                                                <AvatarImage
                                                                    src={
                                                                        !mensagem.responsavel.dirFoto
                                                                            ? "https://placehold.co/600?text=Foto"
                                                                            : mensagem.responsavel.dirFoto
                                                                    }
                                                                    alt="fotoColaborador"
                                                                />
                                                            </Avatar>
                                                        </div>
                                                        <div
                                                            className="w-[50%] p-5 bg-[--color-tec] rounded-xl relative flex flex-col gap-3">
                                                            <h3>
                                                                {selectSolicitacao.solicitacaoSelect?.titulo}
                                                            </h3>
                                                            <span className="text-sm"
                                                                  dangerouslySetInnerHTML={{__html: mensagem.mensagem}}>

                                                </span>
                                                            <span className="smallSpan absolute right-4 bottom-1">
                                                                {mensagem.dataHora.split("T")[1]}
                                                            </span>
                                                            {mensagem.anexos && (
                                                                <ListAnexosBaixar
                                                                    list={JSON.parse(mensagem.anexos)}/>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>

                                                        <div
                                                            className="w-[50%] p-5 bg-[--color-tec] rounded-xl relative flex flex-col gap-3">

                                                            <span className="text-sm"
                                                                  dangerouslySetInnerHTML={{__html: mensagem.mensagem}}>
                                                </span>
                                                            <span className="smallSpan absolute right-4 bottom-1">
                                                                {mensagem.dataHora.split("T")[1]}
                                                            </span>
                                                            {mensagem.anexos && (
                                                                <ListAnexosBaixar
                                                                    list={JSON.parse(mensagem.anexos)}/>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Avatar>
                                                                <AvatarImage
                                                                    src={
                                                                        !mensagem.responsavel.dirFoto
                                                                            ? "https://placehold.co/600?text=Foto"
                                                                            : mensagem.responsavel.dirFoto
                                                                    }
                                                                    alt="fotoColaborador"
                                                                />
                                                            </Avatar>
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </div>

                                    )
                                })}
                            </div>
                        </div>
                        <TicketsSendMensagem/>
                    </div>
                </>
            )}
        </div>
    );
}

function TicketsSendMensagem() {
    const [state, setState] = useState(false);
    const {user, host, configToken} = useContext(MainContext);
    const selectSolicitacao =
        solicitacaoSelectGlobal<solicitacaoSelectGlobalProps>(
            (state: any) => state,
        );
    const [stateAnexo, setStateAnexo] = useState(false)
    const {register, handleSubmit, reset} = useForm();
    const [anexos, setAnexos] = useState([]);
    const displayLounding = stateLoundingGlobal((state: any) => state);
    const [anexoListItens, setAnexoListItens] = useState<File[]>([]);
    const refMensagem = useRef<HTMLDivElement>(null)

    const updateFiles = async (): Promise<string[]> => {
        const updatedAnexos: string[] = [];
        for (let i = 0; i < anexoListItens.length; i++) {
            const formData = new FormData();
            formData.append("file", anexoListItens[i]);
            formData.append("dir", "C:/GrupoQualityWeb/outv2/assets/arquivosTicket");

            try {
                const response = await axios.post(
                    `${host}/suporte/create/update/files`,
                    formData,
                    configToken,
                );
                updatedAnexos.push(`arquivosTicket/${response.data}`);
                setAnexoListItens([]);
            } catch (error) {
                throw new Error("Falha ao enviar o arquivo");
            }
        }
        return updatedAnexos;
    };

    const sendMensagem = async (data: any) => {
        if (refMensagem.current!.innerHTML === "" || !user?.fkAuth) {
            return;
        }
        let updatedAnexos: string[] = [];
        if (anexoListItens.length !== 0) {
            try {
                updatedAnexos = await updateFiles();
            } catch {
                displayLounding.setDisplayFailure(
                    "Falha na tentativa de enviar os documentos. Tente novamente!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
                displayLounding.setDisplayReset();
                return;
            }
        }

        const mensagem: RequestMensagemTiDTO = {
            mensagem: refMensagem.current!.innerHTML,
            referentSolicitacao: selectSolicitacao.solicitacaoSelect?.id,
            responsavel: user?.fkAuth,
            anexos: updatedAnexos.length === 0 ? null : JSON.stringify(updatedAnexos),
        };
        await axios
            .post(`${host}/suporte/create/mensagem`, mensagem, configToken)
            .then(async (response) => {
                setState(false);
                refMensagem.current!.innerHTML = ""
                reset();
                setAnexoListItens([])
            })
            .catch(async (err) => {
                displayLounding.setDisplayFailure(
                    "Falha ao enviar esta mensagem. Tente novamente!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
                displayLounding.setDisplayReset();
            });
    };

    return (
        <>
            <div className={cn("z-10 h-[100px] bg-[var(--color-sec)]", !stateAnexo && "h-0")}>
                <ListAnexos list={anexoListItens} alterList={setAnexoListItens}/>
            </div>
            <form
                onSubmit={handleSubmit(sendMensagem)}
                className={cn("w-full z-20 py-3 bg-[--color-tec] flex items-center justify-start border-t-2 border-slate-600 dark:border-slate-600")}>
                <button onClick={() => {
                    if (stateAnexo) {
                        setAnexoListItens([])
                        setStateAnexo(false)
                    } else {
                        setStateAnexo(true)
                    }
                }}
                        className={"w-[5%] h-full flex items-end justify-center cursor-pointer group"}><Paperclip
                    className={"dark:stroke-slate-400 stroke-slate-600 group-hover:stroke-white"}/></button>
                <div ref={refMensagem} className={"w-[90%] outline-none"} contentEditable={"true"}></div>
                <button type="submit" className={"w-[5%] h-full flex items-end justify-center cursor-pointer group"}>
                    <SendHorizonal
                        className={"dark:stroke-slate-400 stroke-slate-600 group-hover:stroke-white group-active:scale-90 transition-all"}/>
                </button>

            </form>
        </>

    )
        ;
}


function ModalClassificarTicket() {
    const classNameSelect =
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1";

    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const selectSolicitacao =
        solicitacaoSelectGlobal<solicitacaoSelectGlobalProps>(
            (state: any) => state,
        );

    const {register, handleSubmit, reset} = useForm();

    const state = stateModalClassificarTicketGlobal<stateModalProps>(
        (state) => state,
    );
    const {host, user, configToken} = useContext(MainContext);

    const [categorias, setCategorias] = useState<
        CategoriaClassificacaoTiModels[]
    >([]);
    const [subCategorias, setSubCategorias] = useState<SubcategoriaTiModels[]>(
        [],
    );

    const {data: grupos, refetch: refetchGrupos} = useQuery({
        queryKey: ["grupos"],
        queryFn: async (): Promise<GrupoClassificacaoTiModels[]> => {
            if (!configToken) return []
            return await axios
                .get(`${host}/suporte/find/classificar/grupos`, configToken)
                .then((response) => response.data);
        },
        enabled: !!configToken,
        refetchInterval: 1500
    });

    const classificarTicket = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        displayLounding.setDisplayLounding();
        const classificacaoEnviar = {
            ...data,
            responsavel: user?.fkAuth,
            referentSolicitacao: selectSolicitacao.solicitacaoSelect?.id,
        };
        await axios
            .post(
                `${host}/suporte/create/classificar`,
                classificacaoEnviar,
                configToken,
            )
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                selectSolicitacao.setSelect(null);
                state.alterState();
                reset();
            })
            .catch(async () => {
                displayLounding.setDisplayFailure(
                    "Não foi possivel classificar esta solicitação no momento!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            });
    };

    const pularClassificacao = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        displayLounding.setDisplayLounding();
        const classificacaoEnviar = {
            referentSolicitacao: selectSolicitacao.solicitacaoSelect?.id,
        };
        await axios
            .post(
                `${host}/suporte/create/finalizar`,
                classificacaoEnviar,
                configToken,
            )
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                selectSolicitacao.setSelect(null);
                state.alterState();
                reset();
            })
            .catch(async () => {
                displayLounding.setDisplayFailure(
                    "Não foi possivel finalizar esta solicitação no momento!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            });
    };

    return (
        <Dialog open={state.stateModal} modal onOpenChange={state.alterState}>
            <DialogContent className="bg-[var(--color-tec)]">
                <DialogHeader>
                    <DialogTitle>Classificar ticket</DialogTitle>
                    <DialogDescription>
                        Classifique o ticket que você acabou de finalizar, para ajudar em
                        nossa avaliação de ocorrencias
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(classificarTicket)}
                    method="POST"
                    className="flex flex-col gap-5"
                >
                    <div className="flex gap-3">
                        <div>
                            <select
                                {...register("referentGrupo")}
                                onChange={async (e) => {
                                    await axios
                                        .get(
                                            `${host}/suporte/find/classificar/categorias?id=${e.target.value}`,
                                            configToken,
                                        )
                                        .then((response) => setCategorias(response.data));
                                }}
                                className={classNameSelect}
                                defaultValue="null"
                            >
                                <option disabled value="null">
                                    Selecione um grupo
                                </option>
                                {grupos?.map((grupo) => {
                                    return (
                                        <option key={grupo.id} value={grupo.id}>
                                            {grupo.nome}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <select
                                {...register("referentCategoria")}
                                title="Para aparecer as categorias, selecione um grupo"
                                onChange={async (e) => {
                                    await axios
                                        .get(
                                            `${host}/suporte/find/classificar/subcategorias?id=${e.target.value}`,
                                            configToken,
                                        )
                                        .then((response) => setSubCategorias(response.data));
                                }}
                                className={classNameSelect}
                                defaultValue="null"
                            >
                                <option disabled value="null">
                                    Selecione uma categoria
                                </option>
                                {categorias?.map((categoria) => {
                                    return (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nome}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <select
                                {...register("referentSubcategoria")}
                                className={classNameSelect}
                                defaultValue="null"
                            >
                                <option disabled value="null">
                                    Selecione uma sub
                                </option>
                                {subCategorias?.map((subcategoria) => {
                                    return (
                                        <option key={subcategoria.id} value={subcategoria.id}>
                                            {subcategoria.nome}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <LabelInputPadrao.Root
                        register={register}
                        name={"observacao"}
                        title={"Observação"}
                        textArea
                        width={100}
                    />
                    <div className="flex gap-3">
                        <Button type="submit">Classificar</Button>
                        <Button
                            onClick={() => pularClassificacao()}
                            type="button"
                            variant="destructive"
                        >
                            Pula
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ModalReClassificarTicket() {
    const classNameSelect =
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1";

    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const selectSolicitacao =
        solicitacaoSelectGlobal<solicitacaoSelectGlobalProps>(
            (state: any) => state,
        );

    const {register, handleSubmit, reset} = useForm();

    const state = stateModalReClassificarTicketGlobal<stateModalProps>(
        (state) => state,
    );
    const {host, user, configToken} = useContext(MainContext);

    const [categorias, setCategorias] = useState<
        CategoriaClassificacaoTiModels[]
    >([]);
    const [subCategorias, setSubCategorias] = useState<SubcategoriaTiModels[]>(
        [],
    );

    const {data: grupos} = useQuery({
        queryKey: ["grupos"],
        queryFn: async (): Promise<GrupoClassificacaoTiModels[]> => {
            return await axios
                .get(`${host}/suporte/find/classificar/grupos`, configToken)
                .then((response) => response.data);
        },
    });

    const reclassificarTicket = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        displayLounding.setDisplayLounding();
        const classificacaoEnviar = {
            ...data,
            responsavel: user?.fkAuth,
            referentSolicitacao: selectSolicitacao.solicitacaoSelect?.id,
        };
        await axios
            .post(
                `${host}/suporte/create/reclassificar`,
                classificacaoEnviar,
                configToken,
            )
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                selectSolicitacao.setSelect(null);
                state.alterState();
                reset();
            })
            .catch(async () => {
                displayLounding.setDisplayFailure(
                    "Não foi possivel classificar esta solicitação no momento!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            });
    };

    return (
        <Dialog open={state.stateModal} modal onOpenChange={state.alterState}>
            <DialogContent className="bg-[var(--color-tec)] ">
                <DialogHeader>
                    <DialogTitle>Reclassificar ticket</DialogTitle>
                    <DialogDescription>
                        Reclassifique o ticket que você acabou de finalizar, para ajudar em
                        nossa avaliação de ocorrencias
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(reclassificarTicket)}
                    method="POST"
                    className="flex flex-col gap-5 "
                >
                    <div className="flex gap-3 ">
                        <div>
                            <select
                                {...register("referentGrupo")}
                                onChange={async (e) => {
                                    await axios
                                        .get(
                                            `${host}/suporte/find/classificar/categorias?id=${e.target.value}`,
                                            configToken,
                                        )
                                        .then((response) => setCategorias(response.data));
                                }}
                                className={classNameSelect}
                                defaultValue="null"
                            >
                                <option disabled value="null">
                                    Selecione um grupo
                                </option>
                                {grupos?.map((grupo) => {
                                    return (
                                        <option key={grupo.id} value={grupo.id}>
                                            {grupo.nome}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <select
                                {...register("referentCategoria")}
                                title="Para aparecer as categorias, selecione um grupo"
                                onChange={async (e) => {
                                    await axios
                                        .get(
                                            `${host}/suporte/find/classificar/subcategorias?id=${e.target.value}`,
                                            configToken,
                                        )
                                        .then((response) => setSubCategorias(response.data));
                                }}
                                className={classNameSelect}
                                defaultValue="null"
                            >
                                <option disabled value="null">
                                    Selecione uma categoria
                                </option>
                                {categorias?.map((categoria) => {
                                    return (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nome}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <select
                                {...register("referentSubcategoria")}
                                className={classNameSelect}
                                defaultValue="null"
                            >
                                <option disabled value="null">
                                    Selecione uma sub
                                </option>
                                {subCategorias?.map((subcategoria) => {
                                    return (
                                        <option key={subcategoria.id} value={subcategoria.id}>
                                            {subcategoria.nome}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <LabelInputPadrao.Root
                        register={register}
                        name={"observacao"}
                        title={"Observação"}
                        textArea
                        width={100}
                    />
                    <div className="flex gap-3">
                        <Button type="submit">Reclassificar</Button>
                        <Button
                            onClick={() => state.alterState()}
                            type="button"
                            variant="destructive"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

