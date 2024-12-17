import {create} from "zustand"
import {
    AcessoModel,
    AnotacaoRhModels,
    ContabilizacaoDadosAnotacao,
    DocRhModels,
    InfoColaborador,
    InfoColaboradorCompletoDTO, InfoNotifyNotificacaoModels, ItemEstoqueModel, ItemSolicitadoEstoqueModel,
    MensagemTiDTO,
    ResponseFindAnotacaoRhDTO,
    ResponseSocketSolicitacaoTiDTO, SolicitacaoEstoqueModel,
    SolicitcaoTiDTO
} from "@/lib/models";

export type stateLoundingGlobalProps = {
    stateDisplayLounding: boolean
    stateDisplaySuccess: boolean
    stateDisplayFailure: boolean
    setDisplayLounding: () => void
    setDisplaySuccess: (mensagem: string) => void
    setDisplayFailure: (mensagem: string) => void
    setDisplayReset: () => void
}
export const stateLoundingGlobal = create<stateLoundingGlobalProps>((set) => ({
    stateDisplayLounding: false,
    stateDisplaySuccess: false,
    stateDisplayFailure: false,
    mensagem: "",
    setDisplayLounding: () => set((state: any) => ({
        stateDisplayLounding: true,
        stateDisplaySuccess: false,
        stateDisplayFailure: false,
    })),
    setDisplaySuccess: (mensagem: string) => set((state: any) => ({
        stateDisplayLounding: false,
        stateDisplaySuccess: true,
        stateDisplayFailure: false,
        mensagem: mensagem,
    })),
    setDisplayFailure: (mensagem: string) => set((state: any) => ({
        stateDisplayLounding: false,
        stateDisplaySuccess: false,
        stateDisplayFailure: true,
        mensagem: mensagem,
    })),
    setDisplayReset: () => set((state: any) => ({
        stateDisplayLounding: false,
        stateDisplaySuccess: false,
        stateDisplayFailure: false,
    })),
}))

export type stateBarGlobalprops = {
    stateNavBar: boolean
    alterState: () => void
    setBool: (bool: boolean) => void
}
export const stateNavBarGlobal = create<stateBarGlobalprops>((set) => ({
    stateNavBar: false,
    alterState: () => set((state: any) => ({
        stateNavBar: !state.stateNavBar,
    })),
    setBool: (bool: boolean) => set((state: any) => ({
        stateNavBar: bool,
    }))
}))

export const stateListColaboradorBarGlobal = create<stateBarGlobalprops>((set) => ({
    stateNavBar: true,
    alterState: () => set((state: any) => ({
        stateNavBar: !state.stateNavBar,
    })),
    setBool: (bool: boolean) => set((state: any) => ({
        stateNavBar: bool,
    }))
}))

export type solicitacaoSelectGlobalProps = {
    solicitacaoSelect: SolicitcaoTiDTO | null,
    mensagens: MensagemTiDTO[] | null,
    setSelect: (solicitacaoSelected: ResponseSocketSolicitacaoTiDTO | null) => void,
}
export const solicitacaoSelectGlobal = create<solicitacaoSelectGlobalProps>((set) => ({
    solicitacaoSelect: null,
    mensagens: null,
    setSelect: (solicitacaoSelected: ResponseSocketSolicitacaoTiDTO | null) => set((state: any) => ({
        solicitacaoSelect: solicitacaoSelected?.solicitacao,
        mensagens: solicitacaoSelected?.mensagens
    }))
}))

export type stateAlertDialogGlobalProps = {
    titulo: string | null,
    mensagem: string | null,
    action?: any,
    state: boolean
    setState: () => void
    setAlert: (titulo: string | null,
               mensagens: string | null,
               action?: () => void) => void
}
export const stateAlertDialogGlobal = create<stateAlertDialogGlobalProps>((set) => ({
    titulo: null,
    mensagem: null,
    action: undefined,
    state: false,
    setState: () => set((stateGlobal) => ({
        state: !stateGlobal.state
    })),
    setAlert: (titulo: string | null,
               mensagens: string | null,
               action?: any) => set((stateGlobal) => ({
        titulo: titulo,
        mensagem: mensagens,
        action: action,
        state: !stateGlobal.state,
    }))


}))

export type roleColaboradorSelectGlobalProps = {
    role: AcessoModel | null,
    setSelect: (acesso: AcessoModel | null) => void
}
export const roleColaboradorSelectGlobal = create<roleColaboradorSelectGlobalProps>((set) => ({
    role: null,
    setSelect: (acesso: AcessoModel | null) => set((state: any) => ({
        role: acesso
    }))
}))

export type colaboradorSelectGlobalProps = {
    colaborador: InfoColaborador | null
    setColaborador: (colaborador: InfoColaborador | null) => void
}
export const colaboradorSelectGlobal = create<colaboradorSelectGlobalProps>((set) => ({
    colaborador: null,
    setColaborador: (colaborador: InfoColaborador | null) => set((state) => ({
        colaborador: colaborador
    }))
}))

export type stateModalProps = {
    stateModal: boolean
    alterState: () => void,
    setStateModal: (bool: boolean) => void
}
export const stateModalClassificarTicketGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const stateModalReClassificarTicketGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const stateModalDeletarTicketGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const stateModalHistoricoTicketGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const stateModalTrocaRamalGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const stateModalSolicitarTicketGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const stateModalImportDocRhGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export type stateModalDocExistenteProps = {
    stateModal: boolean
    tipo: string
    docExistente: DocRhModels | null
    docReferent: DocRhModels | null
    alterState: () => void
    setDados: (tipo: string, docExistente: DocRhModels, docReferent: DocRhModels) => void
}
export const stateModalImportDocExistenteRhGlobal = create<stateModalDocExistenteProps>((set) => ({
    stateModal: false,
    docExistente: null,
    docReferent: null,
    tipo: "",
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setDados: (tipo: string, docExistente: DocRhModels, docReferent: DocRhModels) => set((state) => ({
        tipo: tipo,
        docReferent: docReferent,
        docExistente: docExistente
    })),
}))

export type pageSelectProps = {
    page: string,
    setPage: (page: string) => void
}
export const pageSelectRhGlobal = create<pageSelectProps>((set) => ({
    page: "Anotações",
    setPage: (page: string) => set((state: any) => ({
        page: page
    }))
}))

export const pageSelectEstoqueGlobal = create<pageSelectProps>((set) => ({
    page: "solicitar",
    setPage: (page: string) => set((state: any) => ({
        page: page
    }))
}))


export type AnotacaoSelectGlobalProps = {
    anotacao: AnotacaoRhModels | null
    setAnotacao: (anotacao: AnotacaoRhModels | null) => void
}
export const anotacaoSelectGlobal = create<AnotacaoSelectGlobalProps>((set) => ({
    anotacao: null,
    setAnotacao: (anotacao: AnotacaoRhModels | null) => set((state) => ({
        anotacao: anotacao
    }))
}))

export const stateModalAnotacaoGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const stateModalAnotacaoCriarGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export type stateAlertDialogPromoverGlobalProps = {
    titulo: string | null,
    mensagem: string | null,
    action?: any,
    state: boolean
    setState: () => void
    data: string
    setAlert: (titulo: string | null,
               mensagens: string | null,
               action: () => void) => void
    setData: (data: string) => void
}

export const stateModalPromoverGlobal = create<stateAlertDialogPromoverGlobalProps>((set) => ({
    titulo: null,
    mensagem: null,
    action: undefined,
    state: false,
    data: "",
    setState: () => set((stateGlobal) => ({
        state: !stateGlobal.state
    })),
    setAlert: (titulo: string | null,
               mensagens: string | null,
               action: any) => set((stateGlobal) => ({
        titulo: titulo,
        mensagem: mensagens,
        action: action,
        state: !stateGlobal.state,
    })),
    setData: (data: string) => set((stateGlobal) => ({
        data: data
    }))
}))

export const stateModalAnotacaoRelatorioGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export type dadosRelatorioSegundaViaProps = {
    dados: ContabilizacaoDadosAnotacao | undefined,
    infoColaborador: InfoColaboradorCompletoDTO | undefined
    anotacoes: AnotacaoRhModels[] | undefined
    dataInicial: string
    dataFinal: string
    setDados: (anotacao: ResponseFindAnotacaoRhDTO) => void
    setDataInicial: (data: string) => void
    setDataFinal: (data: string) => void
}

export const dadosRelatorioSegundaViaGlobal = create<dadosRelatorioSegundaViaProps>((set) => ({
    dados: undefined,
    infoColaborador: undefined,
    anotacoes: undefined,
    dataInicial: "",
    dataFinal: "",
    setDados: (anotacao: ResponseFindAnotacaoRhDTO) => set((state) => ({
        dados: anotacao.dadosContabilizados,
        infoColaborador: anotacao.infoColaborador,
        anotacoes: anotacao.anotacoes
    })),
    setDataInicial: (data: string) => set((state) => ({
        dataInicial: data
    })),
    setDataFinal: (data: string) => set((state) => ({
        dataFinal: data
    }))
}))

export type dadosRelatorioHorasTodosProps = {
    todos: ResponseFindAnotacaoRhDTO[] | undefined
    dataInicial: string
    dataFinal: string
    setDados: (anotacao: ResponseFindAnotacaoRhDTO[]) => void
    setDataInicial: (data: string) => void
    setDataFinal: (data: string) => void
}

export const dadosRelatorioHorasTodosGlobal = create<dadosRelatorioHorasTodosProps>((set) => ({
    todos: undefined,
    dataInicial: "",
    dataFinal: "",
    setDados: (anotacao: ResponseFindAnotacaoRhDTO[]) => set((state) => ({
        todos: anotacao,
    })),
    setDataInicial: (data: string) => set((state) => ({
        dataInicial: data
    })),
    setDataFinal: (data: string) => set((state) => ({
        dataFinal: data
    }))
}))


export const stateModalSelecionarItemEstoqueGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const stateModalEditarItemGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export type itemSelecionadoProps = {
    item: ItemEstoqueModel | undefined,
    setItem: (item: ItemEstoqueModel) => void,
}

export const itemSelecionadoGlobal = create<itemSelecionadoProps>((set) => ({
    item: undefined,
    setItem: (item: ItemEstoqueModel) => set((state) => ({
        item: item,
    }))
}))

export const stateModalFinalizarSolicitacaoEstoqueGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const stateItensSolicitacaoEstoqueGlobal = create<{
    itens: ItemSolicitadoEstoqueModel[],
    setItens: (item: ItemSolicitadoEstoqueModel) => void,
    insertItens: (item: ItemSolicitadoEstoqueModel[]) => void,
    reset: () => void
}>((set) => ({
    itens: [],
    setItens: (item: ItemSolicitadoEstoqueModel) => set((state: { itens: any; }) => ({
        itens: [...state.itens, item]
    })),
    insertItens: (item: ItemSolicitadoEstoqueModel[]) => set((state: { itens: any; }) => ({
        itens: item
    })),
    reset: () => set((state: { itens: any; }) => ({
        itens: []
    }))
}))

export type stateNotifyDateProps = {
    notifys: InfoNotifyNotificacaoModels[] | [],
    tamanhoAntigo: number,
    setNotifys: (notifys: InfoNotifyNotificacaoModels[]) => void,
    setTamanho: (num: number) => void
}

export const stateNotifyDateGlobal = create<stateNotifyDateProps>((set) => ({
    notifys: [],
    tamanhoAntigo: 0,
    setNotifys: (notifys: InfoNotifyNotificacaoModels[]) => set((state) => ({
        notifys: notifys
    })),
    setTamanho: (num: number) => set((state) => ({
        tamanhoAntigo: num
    }))
}))

export const stateModalNotifyGlobal = create<stateModalProps>((set) => ({
    stateModal: false,
    alterState: () => set((state) => ({
        stateModal: !state.stateModal,
    })),
    setStateModal: (bool: boolean) => set((state) => ({
        stateModal: bool
    }))
}))

export const classStyleNavBarIcons = "w-[20px] dark:invert"