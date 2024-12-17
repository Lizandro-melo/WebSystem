import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import {useContext, useRef, useState} from "react";
import {MainContext} from "@/provider/main-provider";
import {
    ItemEstoqueModel,
} from "@/lib/models";
import {alterNomeCompletoParaNomeSobrenome, cn} from "@/lib/utils";
import ContainerSystem from "@/components/container/container-system";

export default function AlertaEstoque() {
    const [state, setState] = useState<boolean>(false);
    const {acessos, host, configToken} = useContext(MainContext)
    const [movimentacoes, setMovimentacoes] = useState<ItemEstoqueModel[]>()
    const {refetch} = useQuery({
        queryKey: ["solicitacoesEstoque"],
        queryFn: async () => {
            return await axios.get(`${host}/estoque/find/alerta`, configToken).then((response) => {
                const movimentacoes: ItemEstoqueModel[] = response.data;
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
                        <Table className="relative bg-[var(--color-tec)]">
                            <TableCaption>...</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                            <span className="flex gap-2 relative items-center justify-between">
                                    N° do item
                        </span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                            <span className="flex gap-2 relative items-center justify-between whitespace-nowrap">
                                Nome do item
                        </span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                                        <span className="whitespace-nowrap">Categoria</span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                            <span className="flex gap-2 relative items-center justify-between">
                            Quantidade atual
                        </span>
                                    </TableHead>
                                    <TableHead className="hover:bg-[var(--color-tec-hover)]">
                        <span className="flex gap-2 relative items-center justify-between">
                            Quantidade minima
                        </span>
                                    </TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movimentacoes?.sort((a, b) => a.id - b.id).map((item, i) => {
                                    return (
                                        <>
                                            <TableRow
                                                className={cn("")}
                                            >
                                                <TableCell>
                                                    <span className="flex gap-2 relative items-center justify-between">
                                                    {item.id}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                     <span className="flex gap-2 relative items-center justify-between">
                                                    {alterNomeCompletoParaNomeSobrenome(item.nome)}
                                                     </span>
                                                </TableCell>

                                                <TableCell>
                                                    <span className="flex gap-2 relative items-center justify-between">
                                                    {item.categoria.nome}
                                        </span>
                                                </TableCell>
                                                <TableCell
                                                    className={cn("bg-red-500")}>
                                                    <span
                                                        className={cn("flex gap-2 relative items-center justify-between")}>
                            {item.quantidade}
                                        </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex gap-2 relative items-center justify-between">
                                                    {item.quantidadeMinima}
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