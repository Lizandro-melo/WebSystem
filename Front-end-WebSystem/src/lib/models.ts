export type InfoColaborador = {
    fkAuth: number
    nomeCompleto: string
    cpf: string
    rg: string
    emissoRg: string
    nuCarteira: string
    pis: string
    nuTitulo: string
    nomeMaterno: string
    cep: string
    dataNascimento: string
    dirFoto: string
    tipo: string
    identificacao: string,
    select: boolean,
    emailCorporativo: string
}

export type AcessoModel = {
    id: number
    referentColaborador: number
    rolesTI: TiAcessoModel
    rolesRH: RhAcessoModel
    rolesEstoque: EstoqueAcessoModel
    rolesDiversos: DiversosAcessoModel
}

export type DiversosAcessoModel = {
    id: number
    botLogistica: boolean
    telefonia: boolean
    trocaRamal: boolean
}

export type TiAcessoModel = {
    id: number
    deletarTicket: boolean
    alterarTicket: boolean
    puxarRelatorio: boolean
    alterarStatus: boolean
    reclassificar: boolean
    delegado: boolean
}

export type RhAcessoModel = {
    id: number
    delegado: boolean
    atualizarDados: boolean
    cadastrarColaborador: boolean
    criarNota: boolean
    deletarDocumento: boolean
    desligarColaborador: boolean
    editarNota: boolean
    gerarRelatorio: boolean
    inativarNota: boolean
    acessoDoc: boolean
}

export type EstoqueAcessoModel = {
    id: number
    delegado: boolean
    controleItem: boolean
    solicitacoes: boolean
    movimentacoes: boolean
    itensAlertas: boolean
    desativarItem: boolean
    darBaixa: boolean
}


export type ResponseSocketSolicitacaoTiDTO = {
    solicitacao: SolicitcaoTiDTO
    mensagens: MensagemTiDTO[]
}

export type SolicitcaoTiModels = {
    id?: number
    solicitante: number | undefined
    dataHora?: string
    titulo: string
    ocorrencia: string
    status?: string
    anexos?: string | null
}

export type MensagemTiModels = {
    id: number
    referentSolicitacao: SolicitcaoTiModels
    mensagem: string
    status: string
    responsavel: number
    dataHora: string
    anexos: string
}

export type MensagemTiDTO = {
    id: number
    referentSolicitacao: number
    mensagem: string
    status: string
    responsavel: InfoColaborador
    dataHora: string
    anexos: string
}

export type RequestSocketSolicitacaoDTO = {
    userId: number | undefined
    solicitacao: SolicitcaoTiDTO
}

export type SolicitcaoTiDTO = {
    id?: number
    solicitante: InfoColaboradorCompletoDTO
    dataHora?: string
    titulo: string
    ocorrencia: string
    status?: string
    anexo?: string
    dataHoraFinalizado?: string,
    select: boolean
}

export type SolicitacaoTiWithMotivoDTO = {
    id?: number
    solicitante: InfoColaborador
    dataHora?: string
    titulo: string
    ocorrencia: string
    motivo: string
    status?: string
    anexo?: string
    dataHoraFinalizado?: string
}

export type ContentSocketTiModels = {
    id?: number
    solicitacao: SolicitcaoTiModels
    user: number
}

export type ContentSocketTiDTO = {
    id?: number
    solicitacao: SolicitcaoTiModels
    user: InfoColaborador
}

export type RequestMensagemTiDTO = {
    referentSolicitacao: number | undefined,
    responsavel: number
    mensagem: string
    anexos: string | null
}

export type GrupoClassificacaoTiModels = {
    id: number
    nome: string
    status: boolean
}

export type SubcategoriaTiModels = {
    id: number
    nome: string
    status: boolean
    referentCategoria: number
}

export type CategoriaClassificacaoTiModels = {
    id: number
    nome: string
    status: boolean
    referentGrupo: number
}

export type DocRhModels = {
    id?: number | undefined
    dir?: string
    tipo?: string
    dataVencimento?: string
    dataEmissao?: string
    tempoAlerta?: string
    referentColaborador: number | undefined
    apelido: string
}

export type TipoDocRhDTO = {
    tipo: string
    doc: DocRhModels
}

export type SubstituirDocRhDTO = {
    docExistente: DocRhModels | null,
    docSubstituto: DocRhModels | null
}

export type EmpresaColaboradorModel = {
    id: number
    nome: string
}

export type SetorColaboradorModel = {
    id: number
    nome: string
}

export type DocExpirandoAlertRhDTO = {
    doc: DocRhModels | null,
    diasRestantes: number
}

export type ContatoColaboradorModel = {
    id?: number
    colaboradorReferent?: InfoColaborador
    tipo?: string
    nuCelular?: string
    nuFixo?: string
    email?: string
    nome?: string
}

export type ContaBancariaColaboradorModel = {
    id?: number
    colaboradorReferent?: InfoColaborador
    nomeBanco?: string
    numeroConta?: string
    numeroAgencia?: string
}

export type InfoCLTColaboradorModel = {
    id: number
    dataAdmissao: string
    dataDemissao: string
    empresa: EmpresaColaboradorModel
    setor: SetorColaboradorModel
}

export type InfoEstagiarioColaboradorModel = {
    id: number
    dataAdmissao: string
    dataDemissao: string
    empresa: EmpresaColaboradorModel
    setor: SetorColaboradorModel
    status: boolean
}

export type InfoMEIColaboradorModel = {
    id: number
    dataAdmissao: string
    dataDemissao: string
    empresa: EmpresaColaboradorModel
    setor: SetorColaboradorModel
    status: boolean
}

export type InfoColaboradorCompletoDTO = {
    authColaborador: AuthColaboradorModel
    infoPessoais: InfoColaborador
    contatos: ContatoColaboradorModel[]
    alergias: AlergiaColaboradorModel[]
    contasBancarias: ContaBancariaColaboradorModel[]
    infoCLT: InfoCLTColaboradorModel
    infoEstagiario: InfoEstagiarioColaboradorModel
    infoMEI: InfoMEIColaboradorModel
}

export type AuthColaboradorModel = {
    id: number
    login: string
    password: string
    status: boolean
    role: string
    alterPass: boolean
}

export type ContabilizacaoDadosAnotacao = {
    atestado: number
    ferias: number
    faltou: number
    suspensao: number
    licenca: number
    atestadoHora: number
    advEscrita: number
    advVerbal: number
    horasExtras: number
    bancoHoras: number
    horasPositivas: number;
    horasNegativas: number;
    atrasos: number
    atrasoTempo: number
}

export type AnotacaoRhModels = {
    id: number;
    responsavel: number;
    colaboradorReferent: number;
    anotacao: string;
    atestado: boolean;
    ferias: boolean;
    faltou: boolean;
    suspensao: boolean;
    licenca: boolean;
    atestadoHora: boolean;
    advEscrita: boolean;
    advVerbal: boolean;
    horaExtra: number;
    dataInicio: string;
    dataFinal: string;
    advEscritaData: string;
    bancoPositivo: number;
    bancoNegativo: number;
    tipoAnotacao: string;
    motivo: string;
    atraso: boolean;
    atrasoTempo: number;
    status: boolean;
    anexo: string | null
};

export type ResponseFindAnotacaoRhDTO = {
    infoColaborador: InfoColaboradorCompletoDTO
    anotacoes: AnotacaoRhModels[]
    dadosContabilizados: ContabilizacaoDadosAnotacao
}

export type RegisterDTO = {
    nomeCompleto: string
    login: string
    email: string
    nCelular: string
    cep: string
    dataNascimento: string
    tipo: string
    dataAdmissao: string
    emailCorporativo: string
    empresa: EmpresaColaboradorModel
    setor: SetorColaboradorModel
}

export type CategoriaEstoqueModel = {
    id: number
    nome: string
    status: boolean
}

export type ItemEstoqueModel = {
    id: number
    nome: string
    status: boolean
    quantidade: number
    quantidadeMinima: number
    dirFoto: string
    descricao: string
    categoria: CategoriaEstoqueModel
}

export type MovimentacaoEstoqueModel = {
    id: number
    quantidade: number
    responsavel: number
    tipo: string
    dataHora: string
    item: ItemEstoqueModel
    solicitacao: SolicitcaoTiModels
}

export type ItemSolicitadoEstoqueModel = {
    id: number
    quantidade: number
    solicitacao: SolicitacaoEstoqueModel
    item: ItemEstoqueModel
}

export type SolicitacaoEstoqueModel = {
    id: number
    solicitante: number
    status: boolean
    dataHora: string
    prioridade: string
    mensagem: string
}

export type SolicitacaoItensEstoqueDTO = {
    solicitacao: SolicitacaoEstoqueModel
    itens: ItemSolicitadoEstoqueModel[],
    nome?: string
    select?: boolean
}

export type MovimentacaoEstoqueDTO = {
    movimentacao: MovimentacaoEstoqueModel,
    nomeResponsavel: string
}

export type AtualizarItemDTO = {
    item: ItemEstoqueModel,
    idColaborador: number
}

export type InfoNotifyNotificacaoModels = {
    id: number,
    destinatario: number,
    titulo: string
    texto: string
    intensao: string
    status: boolean
    show: boolean
}

export type ConfigMatriculaRhModels = {
    id: number
    quantidadeClt: number
    quantidadeEstagiario: number
    quantidadeMei: number
}

export type ConfigVotacaoRhModel = {
    id: number,
    datahoraIni: string,
    dataHoraFinal: string
}

export type ConfigVotacaoRhDTO = {
    config: ConfigVotacaoRhModel,
    candidatos: InfoColaborador[]
}

export type NiverDoMesDTO = {
    nome?: string,
    dataNascimento?: string,
    img?: string
}

export type AlergiaColaboradorModel = {
    id?: number
    colaboradorReferent?: InfoColaborador
    nome?: string
}