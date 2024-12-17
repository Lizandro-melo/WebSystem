import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import {useContext, useRef, useState} from "react";
import {MainContext} from "@/provider/main-provider";
import {ResponseSocketSolicitacaoTiDTO, SolicitacaoItensEstoqueDTO} from "@/lib/models";
import {alterNomeCompletoParaNomeSobrenome, cn, formatDateTimeUser} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {stateLoundingGlobal, stateLoundingGlobalProps} from "@/lib/globalStates";
import {Trash} from "lucide-react";
import ContainerSystem from "@/components/container/container-system";

export default function SolicitacoesEstoque() {
    const [state, setState] = useState<boolean>(false);
    const {acessos, host, configToken} = useContext(MainContext)
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoItensEstoqueDTO[]>()
    const {refetch} = useQuery({
        queryKey: ["solicitacoesEstoque"],
        queryFn: async () => {
            return await axios.get(`${host}/estoque/find/solicitacoes`, configToken).then((response) => {
                const solicitacoes: SolicitacaoItensEstoqueDTO[] = response.data;
                setSolicitacoes(solicitacoes)
                return solicitacoes;
            })
        },
        enabled: !!host && !!configToken
    })
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>((state: any) => state)


    const {mutateAsync: darBaixa} = useMutation({
        mutationFn: async () => {
            displayLounding.setDisplayLounding()
            await axios.put(`${host}/estoque/update/solicitacao`, solicitacoes?.filter(s => s.select), configToken).then(async (response) => {
                displayLounding.setDisplaySuccess(response.data)
                refetch()
                setState(false)
                await new Promise(resolve => setTimeout(resolve, 1500))
                displayLounding.setDisplayReset()
            }).catch(async (err) => {
                displayLounding.setDisplayFailure(err.response.data)
                await new Promise(resolve => setTimeout(resolve, 1500))
                displayLounding.setDisplayReset()
            })
        }
    })

    const {mutateAsync: deletarSolicitacao} = useMutation({
        mutationFn: async (id: number) => {
            displayLounding.setDisplayLounding()
            await axios.delete(`${host}/estoque/update/solicitacao/deletar?id=${id}`, configToken).then(async (response) => {
                displayLounding.setDisplaySuccess(response.data)
                refetch()
                setState(false)
                await new Promise(resolve => setTimeout(resolve, 1500))
                displayLounding.setDisplayReset()
            }).catch(async (err) => {
                displayLounding.setDisplayFailure(err.response.data)
                await new Promise(resolve => setTimeout(resolve, 1500))
                displayLounding.setDisplayReset()
            })
        }
    })


    const selectSolicitacao = (id: number) => {
        setSolicitacoes(prevState => {
            return prevState?.map((s) => {
                if (s.solicitacao.id === id) {
                    s.select = !s.select
                }
                return s
            })
        })
    }

    const selectAll = () => {
        setSolicitacoes(prevState => {
            return prevState?.map((s) => {
                if (s.solicitacao.status) {
                    s.select = true
                }
                return s
            })
        })
    }

    const selectAllOff = () => {
        setSolicitacoes(prevState => {
            return prevState?.map((s) => {
                s.select = false
                return s
            })
        })
    }


    return (
        <>
            <ListarItens state={state} setState={setState} exec={darBaixa} solicitacoes={solicitacoes!}/>
            <ContainerSystem inputsClass={"p-5"}>
                <div className="w-full h-[10%] relative flex gap-5 ">
                    <Button onClick={selectAll}>
                        Marcar tudo
                    </Button>
                    <Button onClick={selectAllOff}>
                        Desmarcar tudo
                    </Button>
                    <Button onClick={() => setState(true)}>
                        Listar itens
                    </Button>
                </div>
                <div className="w-full h-[90%] relative overflow-y-scroll">
                    <div className="absolute w-full">
                        <Table className="relative bg-[var(--color-tec)]">
                            <TableCaption>...</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="  hover:bg-[var(--color-tec-hover)]">
                            <span className="flex gap-2 relative items-center justify-between">
                                    N° solicitação
                        </span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                            <span className="flex gap-2 relative items-center justify-between whitespace-nowrap">
                                Solicitante
                        </span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                                        <span className="whitespace-nowrap">Prioridade</span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                            <span className="flex gap-2 relative items-center justify-between">
                            Situação
                        </span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                        <span className="flex gap-2 relative items-center justify-between">
                            Data e hora
                        </span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                        <span className="flex gap-2 relative items-center justify-between">
                            Motivo
                        </span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                        <span className="flex gap-2 relative items-center justify-between">
                            Ação
                        </span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {solicitacoes?.filter((s, i) => s.solicitacao.status).map((solicitacao, i) => {
                                    return (
                                        <>
                                            <TableRow
                                                className={cn(!solicitacao.select && "hover:bg-blue-300 dark:hover:bg-[#0f172a]", solicitacao.select && "bg-blue-300 hover:bg-stone-300 dark:bg-[#0f172a] dark:hover:bg-[#0f172a]")}
                                                onClick={() => selectSolicitacao(solicitacao.solicitacao.id)}
                                            >
                                                <TableCell className={"hover:bg-[var(--color-tec-hover)]"}>
                                                    <span className="flex gap-2 relative items-center justify-between">
                                                    {solicitacao.solicitacao.id}
                                                    </span>
                                                </TableCell>
                                                <TableCell className={"hover:bg-[var(--color-tec-hover)]"}>
                                                     <span className="flex gap-2 relative items-center justify-between">
                                                    {alterNomeCompletoParaNomeSobrenome(solicitacao.nome)}
                                                     </span>
                                                </TableCell>
                                                <TableCell
                                                    className={cn(solicitacao.solicitacao.prioridade === "alta" && "bg-red-500")}>
                                                    <span
                                                        className={cn("flex gap-2 relative items-center justify-between", solicitacao.solicitacao.prioridade === "alta" && "bg-red-500")}>
                                                    {solicitacao.solicitacao.prioridade === "baixa" ? "Baixa" : "Alta"}
                                        </span>
                                                </TableCell>
                                                <TableCell className={"hover:bg-[var(--color-tec-hover)]"}>
                                                    <span className="flex gap-2 relative items-center justify-between ">
                                                    {solicitacao.solicitacao.status ? "Solicitado" : "Finalizado"}
                                        </span>
                                                </TableCell>
                                                <TableCell className={"hover:bg-[var(--color-tec-hover)]"}>
                                                    <span className="flex gap-2 relative items-center justify-between">
                                                    {formatDateTimeUser(solicitacao.solicitacao.dataHora)}
                                        </span>
                                                </TableCell>
                                                <TableCell className={"hover:bg-[var(--color-tec-hover)]"}>
                                                    <span
                                                        className="flex gap-2 relative items-center justify-between max-w-[200px]">
                                                    {solicitacao.solicitacao.mensagem}
                                        </span>
                                                </TableCell>
                                                <TableCell className={
                                                    "hover:bg-[var(--color-tec-hover)]"
                                                }>
                                                     <span
                                                         className="flex gap-2 relative items-center justify-between min-h-[40px]">
                                                    {solicitacao.solicitacao.status && (
                                                        <Button type={"button"}
                                                                onClick={() => deletarSolicitacao(solicitacao.solicitacao.id)}>
                                                            <Trash className="w-3"/>
                                                        </Button>
                                                    )}
                                                        </span>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </ContainerSystem>

        </>
    )
}

function ListarItens({state, setState, exec, solicitacoes}: {
    state: boolean,
    setState: any,
    exec: () => void,
    solicitacoes: SolicitacaoItensEstoqueDTO[]
}) {

    const lista = useRef(null)
    const {acessos} = useContext(MainContext)

    return (
        <>
            <Dialog open={state} onOpenChange={setState}>
                <DialogContent className="!max-w-[68rem] min-h-[90%]">
                    <DialogHeader>
                        <DialogTitle>Lista de itens selecionados</DialogTitle>
                        <div ref={lista} className="border rounded-xl p-5 w-full h-full">
                            <ul>
                                {solicitacoes?.filter((s) => s.select).map((s) => {
                                    return s.itens.map(i => {
                                        return (
                                            <>
                                                <li className="flex gap-5">
                                                    {alterNomeCompletoParaNomeSobrenome(s.nome)} - {i.item.nome} - {i.quantidade}x
                                                </li>
                                            </>
                                        )
                                    })
                                })}
                            </ul>
                            <div className="absolute bottom-10 flex gap-6">
                                {
                                    acessos?.rolesEstoque.darBaixa && (
                                        <Button type="button" onClick={exec}>
                                            Dar baixa
                                        </Button>
                                    )
                                }
                                <Button type="button" onClick={print}>
                                    Imprimir
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}