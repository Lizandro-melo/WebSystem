import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import {useContext, useRef, useState} from "react";
import {MainContext} from "@/provider/main-provider";
import {MovimentacaoEstoqueDTO, ResponseSocketSolicitacaoTiDTO, SolicitacaoItensEstoqueDTO} from "@/lib/models";
import {alterNomeCompletoParaNomeSobrenome, cn, formatDateTimeUser} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {stateLoundingGlobal, stateLoundingGlobalProps} from "@/lib/globalStates";
import ContainerSystem from "@/components/container/container-system";

export default function MovimentacaoEstoque() {
    const [state, setState] = useState<boolean>(false);
    const {acessos, host, configToken} = useContext(MainContext)
    const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoqueDTO[]>()
    const {refetch} = useQuery({
        queryKey: ["solicitacoesEstoque"],
        queryFn: async () => {
            return await axios.get(`${host}/estoque/find/movimentacao`, configToken).then((response) => {
                const movimentacoes: MovimentacaoEstoqueDTO[] = response.data;
                setMovimentacoes(movimentacoes)
                return movimentacoes;
            })
        },
        enabled: !!host && !!configToken
    })

    return (
        <>
            <ContainerSystem>
                <div className="w-full h-[100%] relative overflow-y-scroll">
                    <div className="absolute w-full">
                        <Table className="relative">
                            <TableCaption>...</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className=" sticky top-1">
                            <span className="flex gap-2 relative items-center justify-between">
                                    N° da movimentação
                        </span>
                                    </TableHead>
                                    <TableHead className="">
                            <span className="flex gap-2 relative items-center justify-between whitespace-nowrap">
                                Responsavel
                        </span>
                                    </TableHead>
                                    <TableHead className="">
                                        <span className="whitespace-nowrap">Tipo</span>
                                    </TableHead>
                                    <TableHead className="">
                            <span className="flex gap-2 relative items-center justify-between">
                            Item
                        </span>
                                    </TableHead>
                                    <TableHead className="">
                        <span className="flex gap-2 relative items-center justify-between">
                            Quantidade
                        </span>
                                    </TableHead>
                                    <TableHead className="">
                        <span className="flex gap-2 relative items-center justify-between">
                            Data e hora
                        </span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movimentacoes?.sort((a, b) => b.movimentacao.id - a.movimentacao.id).map((movimentacao, i) => {
                                    return (
                                        <>
                                            <TableRow
                                                className={cn("hover:bg-transparent")}
                                            >
                                                <TableCell>
                                                    <span className="flex gap-2 relative items-center justify-between">
                                                    {movimentacao.movimentacao.id}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                     <span className="flex gap-2 relative items-center justify-between">
                                                    {alterNomeCompletoParaNomeSobrenome(movimentacao.nomeResponsavel)}
                                                     </span>
                                                </TableCell>
                                                <TableCell
                                                    className={cn(movimentacao.movimentacao.tipo === "saida" ? "bg-red-500 dark:bg-red-700" : "bg-green-500 dark:bg-green-700")}>
                                                    <span
                                                        className={cn("flex gap-2 relative items-center justify-between")}>
                                                    {movimentacao.movimentacao.tipo === "saida" ? "Saida" : "Entrada"}
                                        </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex gap-2 relative items-center justify-between">
                                                    {movimentacao.movimentacao.item.nome}
                                        </span>
                                                </TableCell>

                                                <TableCell>
                                                    <span
                                                        className="flex gap-2 relative items-center justify-between max-w-[200px]">
                                                    {movimentacao.movimentacao.quantidade}
                                        </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex gap-2 relative items-center justify-between">
                                                    {formatDateTimeUser(movimentacao.movimentacao.dataHora)}
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