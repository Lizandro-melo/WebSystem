import {cn} from "@/lib/utils";
import {ReactNode, useContext, useEffect, useState} from "react";
import {
    ResizablePanelGroup,
    ResizablePanel,
} from "../ui/resizable";

import {
    stateAlertDialogGlobal,
    stateAlertDialogGlobalProps,
    stateModalSelecionarItemEstoqueGlobal,
    stateModalProps,
    stateModalFinalizarSolicitacaoEstoqueGlobal,
    stateItensSolicitacaoEstoqueGlobal,
    stateNotifyDateGlobal,
    stateNotifyDateProps,
    stateModalNotifyGlobal,
    stateNavBarGlobal,
} from "@/lib/globalStates";
import {ItemSolicitadoEstoqueModel} from "@/lib/models";
import {MainContext} from "@/provider/main-provider";
import {BellRing, Package, Bolt, DoorOpen} from "lucide-react";
import {Button} from "@/components/ui/button";
import SwitchThemes from "../diversos/essential/switch-themes";

export default function ContainerMain({
                                          children,
                                          inputsClass,
                                          navBar,
                                          ferramentas
                                      }: {
    children?: ReactNode;
    inputsClass?: string;
    navBar?: ReactNode;
    ferramentas?: { titulo: string, children: ReactNode }
}) {
    const state = stateNavBarGlobal((state: any) => state);

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className={cn("w-full h-full ", inputsClass)}
        >
            <ResizablePanel
                defaultSize={state.stateNavBar ? 20 : 8}
                minSize={state.stateNavBar ? 20 : 8}
                maxSize={state.stateNavBar ? 20 : 8}
                onMouseOver={() => state.setBool(true)}
            >
                {navBar}
            </ResizablePanel>
            <ResizablePanel>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={8} minSize={8} maxSize={8}>
                        <Header ferramentas={ferramentas}/>
                    </ResizablePanel>
                    <ResizablePanel>
                        <div
                            onMouseOver={() => state.setBool(false)}
                            className={cn("flex flex-col w-full h-full items-start")}
                        >
                            <div className={cn("flex flex-col w-full h-full")}>
                                <main className="w-full h-full flex items-center justify-center ">
                                    <div
                                        className={cn(
                                            "w-[100%] h-[100%] rounded-md flex ",
                                            inputsClass!,
                                        )}
                                    >
                                        {children}
                                    </div>
                                </main>
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

function Header({ferramentas}: { ferramentas?: { titulo: string, children: ReactNode } }) {
    const {user, acessos, disconnect} = useContext(MainContext);
    const stateAlert = stateAlertDialogGlobal<stateAlertDialogGlobalProps>(
        (state) => state,
    );
    const {stateModal: stateModalSelecionarItem} =
        stateModalSelecionarItemEstoqueGlobal<stateModalProps>((state) => state);
    const [itensSelecionados, setItens] =
        useState<ItemSolicitadoEstoqueModel[]>();
    const stateModalFinalizarSolicitacaoEstoque =
        stateModalFinalizarSolicitacaoEstoqueGlobal<stateModalProps>(
            (state) => state,
        );
    const itensSolicitados = stateItensSolicitacaoEstoqueGlobal<{
        itens: ItemSolicitadoEstoqueModel[];
        setItens: (item: ItemSolicitadoEstoqueModel) => void;
        insertItens: (item: ItemSolicitadoEstoqueModel[]) => void;
        reset: () => void;
    }>((state) => state);
    const notifyAmazem = stateNotifyDateGlobal<stateNotifyDateProps>(
        (state: any) => state,
    );
    const {alterState: alterStateModalNotify} =
        stateModalNotifyGlobal<stateModalProps>((state) => state);

    useEffect(() => {
        setItens(itensSolicitados.itens);
    }, [
        stateModalSelecionarItem,
        stateModalFinalizarSolicitacaoEstoque.stateModal,
    ]);

    return (
        <>
            <header
                className={cn(
                    "w-full dark:bg-slate-900 bg-[var(--color-sec)] h-full px-5 gap-4 flex pr-5 max-md:py-5 justify-end items-center shadow", ferramentas && "!justify-between"
                )}
            >
                {ferramentas && (

                    <div className="flex items-center bg-[var(--color-pri)] h-[35px] gap-3 px-5 rounded-xl">
                        <div>
                            <span className="text-xs text-white uppercase">Ferramentas do {ferramentas.titulo}</span>
                        </div>
                        {ferramentas.children}
                    </div>

                )}
                <div className="flex items-center bg-[var(--color-pri)] h-[35px] gap-3 px-5 rounded-xl">
                    {/*<SwitchThemes inputsClass="dark:text-black" textClass="text-white"/>*/}
                    <Button
                        variant="link"
                        title="Notificações"
                        onClick={() => {
                            alterStateModalNotify();
                        }}
                        className="active:scale-90 transition-all flex gap-1"
                    >
            <span className="font-bold text-white">
              {notifyAmazem?.notifys?.length === 0
                  ? ""
                  : notifyAmazem?.notifys?.length}
            </span>
                        <BellRing className="stroke-white w-[20px] h-[20px] "/>
                    </Button>
                    <Button
                        variant="link"
                        title="Itens solicitados"
                        onClick={() => {
                            stateModalFinalizarSolicitacaoEstoque.alterState();
                        }}
                        className="active:scale-90 transition-all flex gap-1"
                    >
            <span className="font-bold text-white">
              {itensSelecionados?.length === 0 ? "" : itensSelecionados?.length}
            </span>
                        <Package className="stroke-white w-[20px] h-[20px] "/>
                    </Button>
                    <Button
                        onClick={() =>
                            stateAlert.setAlert(
                                "Comfirme",
                                "Você tem certeza que deseja se desconectar?",
                                disconnect,
                            )
                        }
                        variant="link"
                        title="Desconectar"
                        className="active:scale-90 transition-all "
                    >
                        <DoorOpen className="stroke-white w-[20px] h-[20px] "/>
                    </Button>
                </div>
            </header>
        </>
    );
}
