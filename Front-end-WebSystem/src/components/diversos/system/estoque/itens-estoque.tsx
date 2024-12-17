import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import {cn, formatarDataComum} from "@/lib/utils";
import {Label} from "@radix-ui/react-menu";
import {Input} from "@/components/ui/input";
import {Plus, Search, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import {MainContext} from "@/provider/main-provider";
import {
    AtualizarItemDTO,
    CategoriaEstoqueModel,
    ContaBancariaColaboradorModel,
    ContatoColaboradorModel,
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
    stateLoundingGlobal,
    stateLoundingGlobalProps,
    stateModalEditarItemGlobal,
    stateModalFinalizarSolicitacaoEstoqueGlobal,
    stateModalProps,
    stateModalSelecionarItemEstoqueGlobal,
} from "@/lib/globalStates";
import {useForm} from "react-hook-form";
import {parseCookies, setCookie} from "nookies";
import {ScrollArea} from "@/components/ui/scroll-area";
import {number} from "zod";
import ContainerSystem from "@/components/container/container-system";


type filterProps = {
    nome: string;
    categoria: string;
    status: boolean;
};

export default function ItensEstoque() {
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const {host, acessos, configToken} = useContext(MainContext);
    const [item, setItemSelecionado] = useState<ItemEstoqueModel>();
    const [filter, setFilter] = useState<filterProps>({
        nome: "",
        categoria: "",
        status: true,
    });
    const {stateModal: stateModalEditarItem, alterState} =
        stateModalEditarItemGlobal<stateModalProps>((state) => state);

    const {data: itens, refetch} = useQuery({
        queryKey: ["itensEstoque"],
        queryFn: async () => {
            return await axios
                .get(
                    `${host}/estoque/find/itens?nome=${filter.nome}&categoria=${filter.categoria}`,
                    configToken,
                )
                .then((response) => {
                    const itens: ItemEstoqueModel[] = response.data;
                    return itens;
                });
        },
        enabled: !!host && !!configToken,
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
    }, [filter, stateModalEditarItem]);

    const alterFilter = (e: ChangeEvent<any>) => {
        const {name, value} = e.target;

        setFilter((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <>
            <ContainerSystem inputsClass={""}>
                <div className="w-full h-full flex rounded-md">
                    <div
                        className="w-[20%] h-full flex flex-col p-5 gap-5 bg-[var(--color-tec)] border border-slate-600">
                        <div className={cn("flex flex-col gap-3 w-full relative ")}>
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
                    </div>
                    <div
                        className="w-[80%] flex overflow-auto scrowInvivel bg-[var(--color-tec)] border-y border-r border-slate-600">
                        <div className="flex gap-1 w-full justify-center relative flex-wrap">
                            {itens?.map((item) => {
                                return (
                                    <>
                    <span
                        onClick={() => {
                            setItemSelecionado(item);
                            alterState();
                        }}
                        className={cn(
                            "w-full flex items-center justify-between gap-10 px-10   bg-[var(--color-tec)] border-b border-slate-600  cursor-pointer transition-all hover:outline hover:outline-white hover:outline-offset-[-3px]",
                            !item.status && "opacity-30",
                        )}
                    >
                      <div className="w-[110px] h-[110px] flex justify-center items-center relative">
                        <img
                            src={item.dirFoto.replace("..", "")}
                            width={90}
                            height={90}
                            className="w-[90px] h-[90px] absolute"
                            alt=""
                        />
                      </div>
                      <div className="w-full flex items-center">
                        <div className="flex  w-[33%] flex-col gap-2 items-start justify-center h-[70px] scale-90">
                          <span className="text-sm max-w-[180px] whitespace-nowrap overflow-hidden">
                            {item.nome}
                          </span>
                        </div>

                        <div className="flex  w-[33%] flex-col gap-2 items-center justify-center h-[70px] scale-90">
                          <span className="text-sm">Quantidade em estoque</span>
                          <span className="text-sm">{item.quantidade}</span>
                        </div>
                        <div className="flex  w-[33%] flex-col gap-2 items-center justify-center h-[70px] scale-90">
                          <span className="text-sm">Quantidade minima</span>
                          <span className="text-sm">
                            {item.quantidadeMinima}
                          </span>
                        </div>
                      </div>
                    </span>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ContainerSystem>
            <SelecionarItem item={item!}/>
        </>
    );
}

function SelecionarItem({item}: { item: ItemEstoqueModel }) {
    const {host, configToken, acessos, user} = useContext(MainContext);
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const {stateModal: stateModalEditarItem, alterState} =
        stateModalEditarItemGlobal<stateModalProps>((state) => state);
    const {register, setValue, getValues, handleSubmit, reset} = useForm();
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
        reset(item);
    }, [item, reset, stateModalEditarItem]);

    const atualizarItem = async (data: any) => {
        displayLounding.setDisplayLounding();
        const itemAtualizado: AtualizarItemDTO = {
            item: {...data},
            idColaborador: user?.fkAuth!,
        };
        await axios
            .post(`${host}/estoque/update/item`, itemAtualizado, configToken)
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset();
                alterState();
            })
            .catch(async (err) => {
                displayLounding.setDisplayFailure(err.response.data);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset();
            });
    };

    const {mutateAsync: desativarItem} = useMutation({
        mutationFn: async (item: ItemEstoqueModel) => {
            await axios
                .post(`${host}/estoque/update/item/desativar`, item, configToken)
                .then(async (response) => {
                    displayLounding.setDisplaySuccess(response.data);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    displayLounding.setDisplayReset();
                    alterState();
                });
        },
    });

    const {mutateAsync: ativarItem} = useMutation({
        mutationFn: async (item: ItemEstoqueModel) => {
            await axios
                .post(`${host}/estoque/update/item/ativar`, item, configToken)
                .then(async (response) => {
                    displayLounding.setDisplaySuccess(response.data);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    displayLounding.setDisplayReset();
                    alterState();
                });
        },
    });

    const updateFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        formData.append("file", e.target.files![0]);
        formData.append("dir", "C:/GrupoQualityWeb/outv2/img/itensEstoque");

        try {
            const response = await axios
                .post(`${host}/estoque/update/foto`, formData, configToken)
                .then((response) => response);
            setValue("dirFoto", `../img/itensEstoque/${response.data}`);
            reset((formValues) => ({
                ...formValues,
                dirFoto: `../img/itensEstoque/${response.data}`,
            }));
        } catch (error) {
            throw new Error("Falha ao enviar o arquivo");
        }
    };

    return (
        <>
            <Dialog open={stateModalEditarItem} onOpenChange={alterState}>
                <DialogContent className="!max-w-[50rem] min-h-[80%]">
                    <DialogHeader>
                        <ScrollArea className="w-full h-full">
                            <form
                                onSubmit={handleSubmit(atualizarItem)}
                                className="w-full h-full p-5 absolute overflow-auto"
                            >
                                <div className="gap-5 w-full h-full flex flex-col items-center">
                                    <div className="w-[80%] p-5 flex flex-col gap-3 border border-stone-300 rounded-md">
                                        <span className="text-xs">Informações do item</span>
                                        <div className="flex gap-3 w-full justify-center">
                                            <div className="w-[35%] h-full flex items-center justify-center">
                                                {!item?.dirFoto && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="border border-stone-300 rounded-xl h-[100px] w-[100px] flex items-center justify-center flex-none "
                                                    >
                                                        <Plus className="w-3 absolute z-[10]"/>
                                                        <Input
                                                            type="file"
                                                            onChange={updateFile}
                                                            className="text-white z-[20] cursor-pointer bg-transparent file:hidden w-full h-full border border-none"
                                                        />
                                                    </Button>
                                                )}
                                                {item?.dirFoto && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="border border-stone-300 rounded-xl h-[100px] w-[100px] flex items-center justify-center flex-none relative"
                                                    >
                                                        <Input
                                                            type="file"
                                                            onChange={updateFile}
                                                            className="text-white z-[40] cursor-pointer bg-transparent file:hidden w-full h-full border border-none"
                                                        />

                                                        <img
                                                            alt="Foto importada"
                                                            src={getValues().dirFoto}
                                                            width={100}
                                                            height={100}
                                                            className={
                                                                "h-[100px] w-[100px] rounded-xl z-[10] absolute"
                                                            }
                                                        />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 w-full justify-center">
                                            <LabelInputPadrao.Root
                                                name={"nome"}
                                                title={"Nome do item"}
                                                width={100}
                                                register={register}
                                                classNames="w-full"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-3 w-full justify-center flex-col">
                                            <Label className="text-sm">Categoria</Label>
                                            <select
                                                id={"categoria"}
                                                {...register("categoria.nome")}
                                                className={
                                                    "flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                }
                                            >
                                                {categorias?.map(
                                                    (c: CategoriaEstoqueModel, i: number) => {
                                                        return (
                                                            <option key={c.id} value={c?.nome}>
                                                                {c.nome}
                                                            </option>
                                                        );
                                                    },
                                                )}
                                            </select>
                                        </div>
                                        <div className="flex gap-3 w-full justify-center">
                                            <LabelInputPadrao.Root
                                                name={"quantidade"}
                                                title={"Quantidade atual"}
                                                width={50}
                                                register={register}
                                                classNames="w-full"
                                                type="number"
                                            />
                                            <LabelInputPadrao.Root
                                                name={"quantidadeMinima"}
                                                title={"Quantidade minima"}
                                                width={50}
                                                register={register}
                                                classNames="w-full"
                                                type="number"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-3 w-full justify-start">
                                            <Button type="submit">Atualizar</Button>
                                            {acessos?.rolesEstoque.desativarItem && (
                                                <>
                                                    {item?.status ? (
                                                        <Button
                                                            variant="destructive"
                                                            type="button"
                                                            onClick={() => desativarItem(item)}
                                                        >
                                                            Desativar
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="default"
                                                            type="button"
                                                            onClick={() => ativarItem(item)}
                                                        >
                                                            Ativar
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </ScrollArea>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
