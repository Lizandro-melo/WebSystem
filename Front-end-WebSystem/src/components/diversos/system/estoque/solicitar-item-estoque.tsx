import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import {cn} from "@/lib/utils";
import {Label} from "@radix-ui/react-menu";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import {useQuery} from "react-query";
import axios from "axios";
import {MainContext} from "@/provider/main-provider";
import {
    CategoriaEstoqueModel,
    ItemEstoqueModel,
    ItemSolicitadoEstoqueModel,
} from "@/lib/models";
import {
    DialogContent,
    DialogHeader,
    Dialog,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    itemSelecionadoGlobal,
    itemSelecionadoProps,
    stateItensSolicitacaoEstoqueGlobal,
    stateLoundingGlobal,
    stateLoundingGlobalProps,
    stateModalFinalizarSolicitacaoEstoqueGlobal,
    stateModalProps,
    stateModalSelecionarItemEstoqueGlobal,
} from "@/lib/globalStates";
import {useForm} from "react-hook-form";
import {parseCookies, setCookie} from "nookies";
import ContainerSystem from "@/components/container/container-system";


type filterProps = {
    nome: string;
    categoria: string;
};

export default function SolicitarItemEstoque() {
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const {host, acessos, configToken} = useContext(MainContext);
    const {stateModal: stateModalSelecionarItem, alterState} =
        stateModalSelecionarItemEstoqueGlobal<stateModalProps>((state) => state);
    const {setItem: setItemSelecionado} =
        itemSelecionadoGlobal<itemSelecionadoProps>((state) => state);
    const [filter, setFilter] = useState<filterProps>({
        nome: "",
        categoria: "",
    });
    const {stateModal: modalFinalizarSolicitacao} =
        stateModalFinalizarSolicitacaoEstoqueGlobal<stateModalProps>(
            (state) => state,
        );

    const {data: itens, refetch} = useQuery({
        queryKey: ["itensEstoque"],
        queryFn: async () => {
            return await axios
                .get(
                    `${host}/estoque/find/itens?nome=${filter.nome}&categoria=${filter.categoria}`,
                )
                .then((response) => {
                    const itens: ItemEstoqueModel[] = response.data;
                    return itens;
                });
        },
        enabled: !!host,
    });

    const {data: categorias} = useQuery({
        queryKey: ["categoriasEstoque"],
        queryFn: async () => {
            return await axios
                .get(`${host}/estoque/find/categorias`, configToken)
                .then((response) => {
                    const itens: CategoriaEstoqueModel[] = response.data;
                    return itens;
                });
        },
        enabled: !!host && !!configToken,
    });

    useEffect(() => {
        refetch();
    }, [filter, stateModalSelecionarItem, modalFinalizarSolicitacao]);

    const alterFilter = (e: ChangeEvent<any>) => {
        const {name, value} = e.target;

        setFilter((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const selecionarItem = async (item: ItemEstoqueModel) => {
        displayLounding.setDisplayLounding();
        if (item.quantidade <= 0) {
            displayLounding.setDisplayFailure("Item esgotado!");
            await new Promise((resolve) => setTimeout(resolve, 1500));
            displayLounding.setDisplayReset();
            return;
        }
        if (item.quantidade <= 0) {
            displayLounding.setDisplayFailure("Item esgotado!");
            await new Promise((resolve) => setTimeout(resolve, 1500));
            displayLounding.setDisplayReset();
            return;
        }
        setItemSelecionado(item);
        alterState();
        displayLounding.setDisplayReset();
    };

    return (
        <>
            <SelecionarItem/>
            <ContainerSystem inputsClass={" "}>
                <div className="w-full h-full flex rounded-md ">
                    <div
                        className="w-[20%] h-full flex flex-col p-5 gap-5 bg-[var(--color-tec)] border border-slate-600">
                        <div className={cn("flex flex-col gap-3 w-full relative")}>
                            <Label className="text-sm">Pesquisar nome</Label>
                            <Input
                                placeholder="Nome do item"
                                name={"nome"}
                                value={filter.nome}
                                onChange={alterFilter}
                            />
                            <Search
                                className={"stroke-stone-500 absolute bottom-1.5 right-2"}
                            />
                        </div>
                        <div className={cn("flex flex-col gap-3 w-full relative")}>
                            <Label className="text-sm">Categoria</Label>
                            <select
                                name="categoria"
                                onChange={alterFilter}
                                className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Categoria</option>
                                {categorias?.map((categoria) => {
                                    return (
                                        <>
                                            <option key={categoria.id} value={categoria.nome}>
                                                {categoria.nome}
                                            </option>
                                        </>
                                    );
                                })}
                            </select>
                        </div>
                        {/*<Label className="text-sm">Pesquisas recentes</Label>*/}
                        {/*<div className={cn("flex flex-col gap-3 w-full h-full overflow-auto relative")}>*/}
                        {/*    <div className=" w-full overflow-auto h-full flex gap-5 flex-col absolute">*/}
                        {/*        {Array.from({length: 20}).map(() => {*/}
                        {/*            return (*/}
                        {/*                <>*/}
                        {/*                    <Button variant="link" type={"button"}>*/}
                        {/*                        teste*/}
                        {/*                    </Button>*/}
                        {/*                </>*/}
                        {/*            )*/}
                        {/*        })}*/}

                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="w-[80%] flex overflow-auto scrowInvivel bg-[var(--color-tec)] border-y border-r border-slate-600">
                        <div className="flex gap-1 w-full justify-center relative flex-wrap">
                            {itens?.map((item, i) => {
                                return (
                                    <span
                                        key={i}
                                        title={item.nome}
                                        onClick={() => selecionarItem(item)}
                                        className={
                                            "w-[19%] h-[280px] rounded-md bg-[var(--color-tec)] flex justify-center flex-col border cursor-pointer transition-all hover:outline hover:outline-white hover:outline-offset-[-3px]"
                                        }
                                    >
                      <div className="w-full h-[150px] flex justify-center items-center relative">
                        <img
                            width={150}
                            height={150}
                            src={item.dirFoto.replace("..", "")}
                            alt=""
                            className="w-[150px] h-[150px] absolute"
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-center justify-center h-[70px] scale-90">
                        <span className="text-sm max-w-[180px] whitespace-nowrap overflow-hidden">
                          {item.nome}
                        </span>
                        <span className="text-xs">Quantidade</span>
                        <span className="text-xs">{item.quantidade}</span>
                      </div>
                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ContainerSystem>
        </>
    );
}

function SelecionarItem() {
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const {stateModal: stateModalSelecionarItem, alterState} =
        stateModalSelecionarItemEstoqueGlobal<stateModalProps>((state) => state);
    const {item: itemSelecionado} = itemSelecionadoGlobal<itemSelecionadoProps>(
        (state) => state,
    );
    const {register, handleSubmit, reset} = useForm();
    const itensSolicitados = stateItensSolicitacaoEstoqueGlobal<{
        itens: ItemSolicitadoEstoqueModel[];
        setItens: (item: ItemSolicitadoEstoqueModel) => void;
        insertItens: (item: ItemSolicitadoEstoqueModel[]) => void;
        reset: () => void;
    }>((state) => state);

    const addItem = async (data: any) => {
        displayLounding.setDisplayLounding();
        if (itemSelecionado?.quantidade! < data.quantidade) {
            displayLounding.setDisplayFailure("Quantidade indisponivel!");
            await new Promise((resolve) => setTimeout(resolve, 1500));
            displayLounding.setDisplayReset();
            return;
        }
        const item: ItemSolicitadoEstoqueModel = {
            ...data,
            item: itemSelecionado,
        };
        if (
            itensSolicitados.itens.find(
                (itemDaLista) => itemDaLista.item.id === item.item.id,
            )
        ) {
            itensSolicitados.itens = itensSolicitados.itens.filter(
                (itemDaLista) => itemDaLista.item.id !== item.item.id,
            );
            itensSolicitados.setItens(item);
        } else {
            itensSolicitados.setItens(item);
        }
        displayLounding.setDisplaySuccess("Item adicionado à caixa!");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        displayLounding.setDisplayReset();
        alterState();
        reset();
    };

    return (
        <>
            <Dialog open={stateModalSelecionarItem} onOpenChange={alterState}>
                <DialogContent className="bg-[var(--color-tec)]">
                    <DialogHeader>
                        <DialogTitle className="mb-5">
                            Quantos {itemSelecionado?.nome.split(" ")[0].toLowerCase()}
                        </DialogTitle>
                        <form
                            onSubmit={handleSubmit(addItem)}
                            className="flex flex-col gap-5 "
                        >
                            <LabelInputPadrao.Root
                                name={"quantidade"}
                                title={"Quantidade"}
                                width={100}
                                register={register}
                                type="number"
                            />

                            <Button>Adicionar</Button>
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
