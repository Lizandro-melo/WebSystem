import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    stateItensSolicitacaoEstoqueGlobal,
    stateLoundingGlobal,
    stateLoundingGlobalProps,
    stateModalFinalizarSolicitacaoEstoqueGlobal,
    stateModalProps,
    stateModalSelecionarItemEstoqueGlobal,
} from "@/lib/globalStates";
import {useCallback, useContext, useEffect, useState} from "react";
import {
    ItemSolicitadoEstoqueModel,
    SolicitacaoItensEstoqueDTO,
} from "@/lib/models";
import {parseCookies, setCookie} from "nookies";
import {Button} from "@/components/ui/button";
import {Minus, Plus, Trash} from "lucide-react";
import {useForm} from "react-hook-form";
import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import {cn} from "@/lib/utils";
import {Label} from "@radix-ui/react-menu";
import {MainContext} from "@/provider/main-provider";
import axios from "axios";


function ModalFinalizarSolicitacao() {
    const state = stateModalFinalizarSolicitacaoEstoqueGlobal<stateModalProps>(
        (state) => state,
    );
    const [itensSelecionados, setItens] = useState<ItemSolicitadoEstoqueModel[]>(
        [],
    );
    const {host, acessos, configToken, user} = useContext(MainContext);
    const {stateModal: stateModalSelecionarItem} =
        stateModalSelecionarItemEstoqueGlobal<stateModalProps>((state) => state);
    const {register, handleSubmit, getValues, reset, setValue} = useForm();
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const itensSolicitados = stateItensSolicitacaoEstoqueGlobal<{
        itens: ItemSolicitadoEstoqueModel[];
        setItens: (item: ItemSolicitadoEstoqueModel) => void;
        insertItens: (item: ItemSolicitadoEstoqueModel[]) => void;
        reset: () => void;
    }>((state) => state);

    useEffect(() => {
        setItens(itensSolicitados.itens);
    }, [stateModalSelecionarItem]);

    useEffect(() => {
        itensSolicitados.insertItens(itensSelecionados);
    }, [itensSelecionados]);

    const removerItem = (indexItem: number) => {
        setItens((prevState) => {
            if (prevState![indexItem].quantidade <= 1) {
                return prevState?.filter((item, i) => i !== indexItem);
            } else {
                return prevState?.map((item, i) => {
                    if (i === indexItem) {
                        item.quantidade--;
                        if (item.quantidade >= item.item.quantidade) {
                            item.quantidade = item.item.quantidade!;
                        }
                    }
                    return item;
                });
            }
        });
    };

    const addItem = (indexItem: number) => {
        setItens((prevState) => {
            return prevState?.map((item, i) => {
                if (i === indexItem) {
                    item.quantidade++;
                    if (item.quantidade >= item.item.quantidade) {
                        item.quantidade = item.item.quantidade!;
                    }
                }
                return item;
            });
        });
    };

    const enviarSolicitacao = useCallback(
        async (data: any) => {
            displayLounding.setDisplayLounding();
            let createSolicitacao: SolicitacaoItensEstoqueDTO = {
                solicitacao: {
                    ...data,
                    solicitante: user?.fkAuth,
                },
                itens: itensSelecionados!,
            };

            axios
                .post(
                    `${host}/estoque/create/solicitacao`,
                    createSolicitacao,
                    configToken,
                )
                .then(async (response) => {
                    displayLounding.setDisplaySuccess(response.data);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    displayLounding.setDisplayReset();
                    reset();
                    setItens([]);
                    itensSolicitados.reset();
                    state.alterState();
                })
                .catch(async (err) => {
                    displayLounding.setDisplayFailure(err.response.data);
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    displayLounding.setDisplayReset();
                });
        },
        [user?.fkAuth, itensSelecionados, host, configToken],
    );

    return (
        <>
            <Dialog open={state.stateModal} onOpenChange={state.alterState}>
                <DialogContent className="!max-w-[60rem] min-h-[80%]">
                    <DialogHeader>
                        <DialogTitle>Finalizar pedido</DialogTitle>
                        <div className="border rounded-xl p-5 h-full w-full flex gap-5">
                            <form
                                className="w-[50%] h-full flex flex-col gap-5"
                                onSubmit={handleSubmit(enviarSolicitacao)}
                            >
                <span className="text-xs">
                  A partir das 10H é obrigatorio definir a “Prioridade“, caso a
                  prioridade sejá alta é obrigatorio descrever o “Motivo“!
                </span>
                                {(new Date().getHours() >= 10) && (
                                    <div className="w-[100%] h-full flex flex-col gap-5 relative">
                                        
                                        <div className={cn("flex flex-col gap-3 w-full relative")}>
                                            <Label className="text-sm">Prioridade</Label>
                                            <select
                                                {...register("prioridade")}
                                                className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="baixa">Baixa</option>
                                                <option value="alta">Alta</option>
                                            </select>
                                        </div>
                                        <LabelInputPadrao.Root
                                            name={"mensagem"}
                                            title={"Motivo"}
                                            register={register}
                                            textArea
                                            width={100}
                                        />
                                    </div>
                                )}
                                <div>
                                    <Button type="submit" autoFocus={true}>
                                        Solicitar
                                    </Button>
                                </div>
                            </form>
                            <div className="w-[50%] h-full relative overflow-auto">
                                <ul className="w-full h-full absolute flex flex-col gap-5 py-2">
                                    {itensSelecionados?.map((item, i) => {
                                        return (
                                            <>
                                                <li
                                                    key={i}
                                                    className="flex w-full h-[80px] items-center gap-5 justify-between p-5"
                                                >
                                                    <div className="max-w-[80px] h-[80px]">
                                                        <img
                                                            width={80}
                                                            height={80}
                                                            src={item.item?.dirFoto}
                                                            className="w-[80px] h-[80px] rounded-xl"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <span
                                                        className="smallSpan whitespace-nowrap min-w-[105px] max-w-[105px] overflow-hidden">
                            {item.item.nome}
                          </span>
                                                    <div className="flex items-center gap-5 max-w-[105px]">
                                                        <Button onClick={() => addItem(i)}>
                                                            <Plus className="w-3 absolute z-[10]"/>
                                                        </Button>
                                                        <span className="text-sm font-bold">
                              {item.quantidade}
                            </span>
                                                        <Button onClick={() => removerItem(i)}>
                                                            {item.quantidade <= 1 ? (
                                                                <Trash className="w-3 absolute z-[10]"/>
                                                            ) : (
                                                                <Minus className="w-3 absolute z-[10]"/>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </li>
                                                <hr className="border-stone-400"/>
                                            </>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
        ;
}
