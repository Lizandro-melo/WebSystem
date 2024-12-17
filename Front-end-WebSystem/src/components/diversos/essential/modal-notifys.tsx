import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {
    
    stateLoundingGlobal, stateLoundingGlobalProps, stateModalNotifyGlobal,
 stateNotifyDateGlobal, stateNotifyDateProps
} from "@/lib/globalStates";
import {useContext, useEffect, useState} from "react";

import {Button} from "@/components/ui/button";
import {MessageCircleQuestion, Package, Trash} from "lucide-react";
import { visualizarNotify} from "@/lib/utils";
import {MainContext} from "@/provider/main-provider";
import axios from "axios";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function ModalNotifys() {

    const {host, acessos, configToken, user} = useContext(MainContext);
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>((state: any) => state)
    const notifyAmazem = stateNotifyDateGlobal<stateNotifyDateProps>((state: any) => state)
    const {stateModal, alterState, setState} = stateModalNotifyGlobal<any>((state) => state)
    const [quantidade, setQuantidade] = useState({
        sistema: 0,
        rh: 0,
        estoque: 0,
        suporte: 0
    })
    const [filtro, setFiltro] = useState("sistema")

    useEffect(() => {
        setQuantidade(prevState => ({
            ...prevState,
            estoque: notifyAmazem.notifys.filter(value => value.intensao === "estoque").length,
            suporte: notifyAmazem.notifys.filter(value => value.intensao === "suporte").length,
            rh: notifyAmazem.notifys.filter(value => value.intensao === "rh").length,
            sistema: notifyAmazem.notifys.filter(value => value.intensao === "sistema").length,
        }))
    }, [notifyAmazem.tamanhoAntigo]);


    return (
        <>
            <Dialog open={stateModal} onOpenChange={alterState}>
                <DialogContent className="!max-w-[60rem] min-h-[80%]">
                    <DialogHeader>
                        <DialogTitle>Painel de notificações</DialogTitle>
                        <div className="border rounded-xl p-5 h-full w-full flex gap-5">
                            <div className="w-[50%] h-full flex flex-col gap-5 py-2"
                            >
                                <div className="w-full h-full flex flex-col gap-5 items-start justify-start relative">
                                    <Button onClick={() => setFiltro("sistema")}
                                            className="w-[80%] h-[50px] flex justify-between">
                                        <span>
                                        {quantidade.sistema}
                                        </span>
                                        <span>
                                        Sistema
                                        </span>
                                    </Button>
                                    <Button
                                        onClick={() => setFiltro("rh")}
                                        className="w-[80%] h-[50px] flex justify-between">
                                        <span>
                                        {quantidade.rh}
                                        </span>
                                        <span>
                                        RH
                                        </span>
                                    </Button>
                                    <Button onClick={() => setFiltro("estoque")}
                                            className="w-[80%] h-[50px] flex justify-between">
                                        <span>
                                        {quantidade.estoque}
                                        </span>
                                        <span>
                                        Estoque
                                        </span>
                                    </Button>
                                    <Button onClick={() => setFiltro("suporte")}
                                            className="w-[80%] h-[50px] flex justify-between">
                                        <span>
                                        {quantidade.suporte}
                                        </span>
                                        <span>
                                        Suporte
                                        </span>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                className="w-[80%] h-[50px] bottom-0 flex justify-center absolute">
                                        <span>
                                        Limpar Tudo
                                        </span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Limpar Tudo</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Confirmar irá apagar todas as notificações.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={async () => {
                                                    await axios.get(`${host}/notify/update/limpar?id=${user?.fkAuth}`, configToken)
                                                    notifyAmazem.setTamanho(0)
                                                    notifyAmazem.setNotifys([])
                                                }}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>


                                </div>
                            </div>
                            <div className="w-[50%] h-full relative overflow-auto">
                                <ul className="w-full h-full absolute flex flex-col gap-5 py-2">
                                    {notifyAmazem.notifys.filter(value => value.intensao === filtro).sort((a, b) => b.id - a.id).map(notify => {
                                        return (
                                            <li
                                                className={"border z-20 border-stone-600 cursor-pointer w-full p-2  rounded-xl flex flex-col gap-2 active:scale-95 transition-all"}
                                                key={notify.id}>
                                                <div className="flex items-center gap-5 w-full relative">
                                                    <div onClick={() => {
                                                        visualizarNotify(notify, host, configToken, setState)
                                                    }}
                                                         className="bg-blue-950 w-[40px] h-[40px] flex justify-center items-center rounded-md">
                                                        {notify.intensao === "estoque" && (
                                                            <Package className="invert w-[17px] h-[17px]"/>
                                                        )}
                                                        {notify.intensao === "suporte" && (
                                                            <MessageCircleQuestion
                                                                className="invert w-[17px] h-[17px]"/>
                                                        )}
                                                    </div>
                                                    <span onClick={() => {
                                                        visualizarNotify(notify, host, configToken, setState)
                                                    }} className="text-sm font-semibold">{notify.titulo} </span>
                                                    <Button type="button" onClick={async () => {
                                                        await axios.get(`${host}/notify/update/desative?id=${notify.id}`, configToken)
                                                        notifyAmazem.setTamanho(notifyAmazem.tamanhoAntigo - 1)
                                                        notifyAmazem.setNotifys(notifyAmazem.notifys.filter((value, index) => value.id !== notify.id))
                                                    }} variant="destructive"
                                                            className="w-[30px] h-[30px] absolute right-3 z-[60]"><Trash
                                                        className="w-[17px] h-[17px] absolute"/></Button>
                                                </div>
                                                <span onClick={() => {
                                                    visualizarNotify(notify, host, configToken, setState)
                                                }} className="text-sm">{notify.texto}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}