import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {useMutation, useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {MainContext} from "@/provider/main-provider";
import {
    CategoriaClassificacaoTiModels,
    InfoColaborador,
    ResponseSocketSolicitacaoTiDTO,
    SolicitacaoTiWithMotivoDTO, SolicitcaoTiDTO
} from "@/lib/models";
import {alterNomeCompletoParaNomeSobrenome, data1MesAtrasInput, dataAtualInput, formatDateTimeUser} from "@/lib/utils";
import {
    solicitacaoSelectGlobal,
    solicitacaoSelectGlobalProps, stateLoundingGlobal, stateLoundingGlobalProps,
    stateModalHistoricoTicketGlobal,
    stateModalProps
} from "@/lib/globalStates";
import {Label} from "@/components/ui/label";
import Router from "next/router";

type filtroType = {
    idSolicitacao?: number
    solicitante?: number
    tipo?: string
    dataInicio?: string,
    dataFinal?: string
}

export function ListaSolicitacoes() {
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>((state: any) => state)
    const selectSolicitacao = solicitacaoSelectGlobal<solicitacaoSelectGlobalProps>((state: any) => state)
    const state = stateModalHistoricoTicketGlobal<stateModalProps>((state) => state)
    const {host, user, acessos, configToken} = useContext(MainContext)
    const [filtro, setFiltro] = useState<filtroType>()
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoTiWithMotivoDTO[]>()

    const {mutateAsync: filtrar} = useMutation({
        mutationFn: async () => {
            await axios.post(`${host}/suporte/find/solicitacao/all`, filtro, configToken).then((response) => {
                setSolicitacoes(response.data)
            }).catch((e) => {
                return
            })
        }
    })

    const {data: categorias} = useQuery({
        queryKey: ["categorias"],
        queryFn: async () => {
            return await axios.get(`${host}/suporte/find/classificar/categorias/all`, configToken).then(response => {
                const categorias: CategoriaClassificacaoTiModels[] = response.data
                return categorias
            })
        }
    })

    const alterFilter = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const {name, value} = e.target
        setFiltro((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    }

    const filterExterno = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        if (value == "") {
            filtrar()
        }
        setSolicitacoes((prevState) => {
            return prevState?.filter(e => e.status == value)
        })
    }

    const joinSolicitacao = async (idSolicitacao: number | undefined) => {
        displayLounding.setDisplayLounding()
        await axios.get(`${host}/suporte/find/solicitacao/exatc?id=${idSolicitacao}`, configToken).then(async (response) => {
            const solicitacaoSelect: ResponseSocketSolicitacaoTiDTO = response.data
            selectSolicitacao.setSelect(solicitacaoSelect);
            displayLounding.setDisplaySuccess(`Solicitacão ${idSolicitacao}, carregada com sucesso!`)
            displayLounding.setDisplayReset()
            state.alterState()
            Router.push("/suporte")
        }).catch(async (err) => {
            displayLounding.setDisplayFailure("Não foi possivel carregar está solicitacão!")
            await new Promise(resolve => setTimeout(resolve, 1000))
            displayLounding.setDisplayReset()
        })
    }

    useEffect(() => {
        setFiltro(prevState => ({
            solicitante: user?.fkAuth,
            dataInicio: data1MesAtrasInput(),
            dataFinal: dataAtualInput()
        }))
    }, []);

    useEffect(() => {
        if (!configToken || !host) {
            return
        }
        if (filtro?.solicitante == null) {
            return;
        }
        filtrar()
    }, [filtro, configToken, host]);

    return (
        <>
            <div className="w-full h-full relative overflow-y-scroll">
                <div className="absolute">
                    <Table className="relative">
                        <TableCaption>...</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hover:bg-slate-100 sticky top-1">
                            <span className="flex gap-2 relative items-center justify-between">
                                    <Input className="border-none bg-transparent focus-visible:!ring-0 "
                                           placeholder="N° solicitação" type="number" name="idSolicitacao"
                                           onChange={alterFilter}
                                    />
                        </span>
                                </TableHead>
                                <TableHead className="hover:bg-slate-100">
                                    <span className="whitespace-nowrap">Solicitante</span>
                                </TableHead>
                                <TableHead className="hover:bg-slate-100">
                            <span className="flex gap-2 relative items-center justify-between">
                            <Input className="border-none bg-transparent focus-visible:!ring-0 " placeholder="Situação"
                                   type="text" name="situacao"
                                   list="status"
                                   onChange={filterExterno}
                            />
                                 <datalist id="status">
                                    <option value={"PENDENTE"}>PENDENTE</option>
                                    <option value={"FINALIZADO"}>FINALIZADO</option>
                                </datalist>
                        </span>
                                </TableHead>

                                <TableHead className="hover:bg-slate-100">
                                    <span className="flex gap-2 relative items-center justify-between">
                                        Motivo
                                    </span>
                                </TableHead>

                                <TableHead className="hover:bg-slate-100 ">
                                    {filtro && (
                                        <span className="flex gap-2 relative items-center justify-between">
                                         <Input className="border-none bg-transparent focus-visible:!ring-0 "
                                                placeholder="Data de inicio" type="date" name="dataInicio"
                                                value={filtro.dataInicio}
                                                onChange={alterFilter}
                                         />
                                    </span>
                                    )}
                                </TableHead>
                                <TableHead className="hover:bg-slate-100 ">
                                    {filtro && (
                                        <span className="flex gap-2 relative items-center justify-between">
                                         <Input className="border-none bg-transparent focus-visible:!ring-0 "
                                                placeholder="Data de final" type="date" name="dataFinal"
                                                value={filtro.dataFinal}
                                                onChange={alterFilter}
                                         />
                                    </span>
                                    )}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {solicitacoes?.sort((a: any, b: any) => b.id - a.id).map((solicitacao) => {
                                return (
                                    <TableRow key={solicitacao.id} className="cursor-pointer"
                                              onClick={() => joinSolicitacao(solicitacao.id)}
                                    >
                                        <TableCell>{solicitacao.id}</TableCell>
                                        <TableCell>{alterNomeCompletoParaNomeSobrenome(solicitacao.solicitante.nomeCompleto)}</TableCell>
                                        <TableCell>{solicitacao.status}</TableCell>
                                        <TableCell>{solicitacao.motivo}</TableCell>
                                        <TableCell
                                            className="whitespace-nowrap">{formatDateTimeUser(solicitacao.dataHora)}</TableCell>
                                        <TableCell
                                            className="whitespace-nowrap">{formatDateTimeUser(solicitacao.dataHoraFinalizado)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}