import {createContext, ReactNode, useContext, useEffect} from "react";
import Router from "next/router";
import {MainContext, MainProvider} from "@/provider/main-provider";
import {useQuery} from "react-query";
import {stateModalNotifyGlobal, stateNotifyDateGlobal, stateNotifyDateProps} from "@/lib/globalStates";
import axios from "axios";
import {InfoNotifyNotificacaoModels} from "@/lib/models";
import {visualizarNotify} from "@/lib/utils";


export const NotifyContext = createContext(null)

export function NotifyProvider({children}: { children: ReactNode }) {

    const {host, configToken, user} = useContext(MainContext)
    const notifyAmazem = stateNotifyDateGlobal<stateNotifyDateProps>((state: any) => state)
    const {stateModal, alterState, setStateModal} = stateModalNotifyGlobal<any>((state) => state)
    const {} = useQuery({
        queryKey: ["notify"],
        queryFn: async () => {
            return await axios.get(`${host}/notify/find/my?id=${user?.fkAuth}`, configToken).then((response) => {
                const notifys: InfoNotifyNotificacaoModels[] = response.data
                notifyAmazem.setNotifys(notifys!)
                return notifys
            })

        },
        enabled: !!host && !!configToken && !!user?.fkAuth,
        refetchInterval: 2500,
        refetchIntervalInBackground: true
    })

    useEffect(() => {
        if (notifyAmazem.notifys?.length > notifyAmazem.tamanhoAntigo) {
            const ultimaNotify = notifyAmazem.notifys[notifyAmazem.notifys?.length - 1]
            notifyAmazem.setTamanho(notifyAmazem.notifys?.length)
            if (ultimaNotify.show) {
                return
            } else {
                new Notification(ultimaNotify?.titulo, {
                    body: ultimaNotify?.texto,
                    requireInteraction: true
                }).onclick = () => {
                    visualizarNotify(ultimaNotify, host, configToken, setStateModal)
                }
            }
        }
    }, [notifyAmazem.notifys, notifyAmazem.notifys?.length]);

    return (
        <NotifyContext.Provider value={null}>
            {children}
        </NotifyContext.Provider>
    )
}