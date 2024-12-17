import React, {
    ChangeEvent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import ListColaboradoresAtivos from "@/components/diversos/essential/ListColaboradoresAtivos";
import {
    colaboradorSelectGlobal,
    colaboradorSelectGlobalProps,
    roleColaboradorSelectGlobal,
    roleColaboradorSelectGlobalProps,
    stateBarGlobalprops,
    stateListColaboradorBarGlobal,
    stateLoundingGlobal,
    stateLoundingGlobalProps,
} from "@/lib/globalStates";
import {
    AcessoModel,
    DiversosAcessoModel,
    EstoqueAcessoModel,
    RhAcessoModel,
    TiAcessoModel,
} from "@/lib/models";
import axios from "axios";
import {MainContext} from "@/provider/main-provider";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import ContainerSystem from "@/components/container/container-system";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {ScrollArea} from "@/components/ui/scroll-area";
import {CircleX} from "lucide-react";
import {cn} from "@/lib/utils";

export function ConfigsRolesRoot() {
    return (
        <>
            <ListColaboradoresAtivos tipoSelect/>
            <RolesOptions/>
        </>
    );
}

function RolesOptions() {
    const state = stateListColaboradorBarGlobal<stateBarGlobalprops>(
        (state: any) => state,
    );
    const {host, configToken} = useContext(MainContext);
    const roleSelect =
        roleColaboradorSelectGlobal<roleColaboradorSelectGlobalProps>(
            (state: any) => state,
        );
    const [rolesTI, setRolesTI] = useState<TiAcessoModel | null>();
    const [rolesRH, setRolesRH] = useState<RhAcessoModel | null>();
    const [rolesEstoque, setRoleEstoque] = useState<EstoqueAcessoModel | null>();
    const [rolesDiversos, setRolesDiversos] = useState<DiversosAcessoModel | null>();
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
        (state: any) => state,
    );
    const colaboradorSelect =
        colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
            (state: any) => state,
        );

    useEffect(() => {
        setRolesTI(roleSelect.role?.rolesTI);
        setRolesRH(roleSelect.role?.rolesRH);
        setRoleEstoque(roleSelect.role?.rolesEstoque);
        setRolesDiversos(roleSelect.role?.rolesDiversos);
    }, [roleSelect.role]);

    const alterRoleTi = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const {name, checked} = e.target;

            if (name !== "delegado") {
                if (checked) {
                    setRolesTI((prevState: any) => ({...prevState, delegado: true}));
                }
            }
            setRolesTI((prevState: any) => ({...prevState, [name]: checked}));
        },
        [rolesTI],
    );

    const alterRoleRh = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const {name, checked} = e.target;

            if (name !== "delegado") {
                if (checked) {
                    setRolesRH((prevState: any) => ({...prevState, delegado: true}));
                }
            }
            setRolesRH((prevState: any) => ({...prevState, [name]: checked}));
        },
        [rolesRH],
    );

    const alterRoleEstoque = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const {name, checked} = e.target;

            if (name !== "delegado") {
                if (checked) {
                    setRoleEstoque((prevState: any) => ({
                        ...prevState,
                        delegado: true,
                    }));
                }
            }
            setRoleEstoque((prevState: any) => ({...prevState, [name]: checked}));
        },
        [rolesEstoque],
    );

    const alterRoleDiversos = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const {name, checked} = e.target;

            setRolesDiversos((prevState: any) => ({...prevState, [name]: checked}));
        },
        [rolesDiversos],
    );

    const atualizarRoles = async () => {
        displayLounding.setDisplayLounding();
        await new Promise((resolve) => setTimeout(resolve, 500));
        const acessos: AcessoModel = {
            ...roleSelect.role!,
            rolesTI: rolesTI!,
            rolesRH: rolesRH!,
            rolesEstoque: rolesEstoque!,
            rolesDiversos: rolesDiversos!,
        };
        console.log(acessos);
        if (JSON.stringify(acessos) != JSON.stringify(roleSelect.role)) {
            await axios
                .put(`${host}/sistema/upload/roles`, acessos, configToken)
                .then(async (response) => {
                    displayLounding.setDisplaySuccess(response.data);
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    displayLounding.setDisplayReset();
                })
                .catch(async () => {
                    displayLounding.setDisplayFailure(
                        "Não foi possivel atualizar as permissões deste usuario no momento!",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    displayLounding.setDisplayReset();
                });
            return;
        } else {
            displayLounding.setDisplayFailure("Não foi feita nenhuma alteração!");
            await new Promise((resolve) => setTimeout(resolve, 1800));
            displayLounding.setDisplayReset();
        }
    };

    const redefinirRoles = async () => {
        await axios
            .get(
                `${host}/colaborador/find/roles?id=${roleSelect.role?.referentColaborador}`,
                configToken,
            )
            .then((response) => {
                const role: AcessoModel = response.data;
                roleSelect.setSelect(role);
            })
            .then(async () => {
                displayLounding.setDisplaySuccess("Permissões redefinidas");
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            })
            .catch(async () => {
                displayLounding.setDisplayFailure(
                    "Não conseguimos recuperar as permissões deste usuario no momento!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1800));
                displayLounding.setDisplayReset();
            });
    };

    const configurarRoles = async () => {
        displayLounding.setDisplayLounding();
        await new Promise((resolve) => setTimeout(resolve, 500));
        await axios
            .get(
                `${host}/sistema/upload/create/acesso?id=${colaboradorSelect.colaborador?.fkAuth}`,
                configToken,
            )
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                await axios
                    .get(
                        `${host}/colaborador/find/roles?id=${colaboradorSelect.colaborador?.fkAuth}`,
                        configToken,
                    )
                    .then((response) => {
                        const role: AcessoModel = response.data;
                        roleSelect.setSelect(role);
                    });
            })
            .catch(async () => {
                displayLounding.setDisplayFailure(
                    "Não foi possivel criar os acessos deste colaborador no momento!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            });
    };

    return (
        <>
            <ContainerSystem>

                <div
                    className="h-full w-[100%] rounded-r-md relative overflow-hidden "
                >
                    {(!colaboradorSelect.colaborador) && (
                        <div
                            className="w-full bg-white dark:bg-slate-950 h-full absolute opacity-70 z-[60]  flex items-center justify-center">
                            <div className="w-full flex flex-col gap-5 items-center z-20">
                                <CircleX className={cn("w-[80px] h-[80px] stroke-red-700 z-[100]")}/>
                                <span
                                    className="text-center font-bold text-stone-800  z-20">Selecione um colaborador</span>
                            </div>
                        </div>
                    )}
                    {(!roleSelect.role && colaboradorSelect.colaborador) && (
                        <div
                            className="w-full bg-white dark:bg-slate-950 h-full absolute opacity-70 z-[50]  flex items-center justify-center">
                            <div className="w-full flex flex-col gap-5 items-center z-20">
                                <CircleX className={cn("w-[80px] h-[80px] stroke-red-700 z-[100]")}/>
                                <span
                                    className="text-center font-bold text-stone-800  z-20">Permissões não configuradas!</span>
                                <Button onClick={() => configurarRoles()} type="button">
                                    Configurar
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col w-full h-full">
                        <div className="flex gap-5 items-center px-5 py-5 relative left-2">
                            <Avatar>
                                <AvatarImage
                                    src={`.${colaboradorSelect.colaborador?.dirFoto}`}
                                />
                            </Avatar>
                            <span className="text-xs">
                {colaboradorSelect.colaborador?.nomeCompleto}
              </span>
                        </div>
                        <div className="bg-slate-950 w-full h-full flex flex-col">
                            <div className="w-full h-[40px] bg-slate-900 flex items-center px-5">
                                <span>Permissões</span>
                            </div>
                            <div className="w-full h-full p-5 relative">
                                <div className="flex flex-col gap-5 pb-10 absolute overflow-scroll w-full h-full">
                                    <div className="flex flex-col gap-5">
                                        <legend>Permissões de TI</legend>
                                        <hr/>
                                        <ul className="flex gap-2 flex-col">
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleTi}
                                                    name="delegado"
                                                    id="delegadoTi"
                                                    checked={rolesTI?.delegado}
                                                />
                                                <Label htmlFor="delegadoTi">Integrante</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleTi}
                                                    name="deletarTicket"
                                                    id="deletarTicket"
                                                    checked={rolesTI?.deletarTicket}
                                                />
                                                <Label htmlFor="deletarTicket">Deletar ticket</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleTi}
                                                    name="reclassificar"
                                                    id="reclassificar"
                                                    checked={rolesTI?.reclassificar}
                                                />
                                                <Label htmlFor="reclassificar">
                                                    Reclassificar solicitação
                                                </Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleTi}
                                                    name="puxarRelatorio"
                                                    id="puxarRelatorio"
                                                    checked={rolesTI?.puxarRelatorio}
                                                />
                                                <Label htmlFor="puxarRelatorio">
                                                    Consultar relatório
                                                </Label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        <legend>Permissões do RH</legend>
                                        <hr/>
                                        <ul className="flex gap-2 flex-col">
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="delegado"
                                                    id="delegadoRh"
                                                    checked={rolesRH?.delegado}
                                                />
                                                <Label htmlFor="delegadoRh">Integrante</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="criarNota"
                                                    id="criarNota"
                                                    checked={rolesRH?.criarNota}
                                                />
                                                <Label htmlFor="criarNota">Criar nota</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="editarNota"
                                                    id="editarNota"
                                                    checked={rolesRH?.editarNota}
                                                />
                                                <Label htmlFor="editarNota">Editar nota</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="desligarColaborador"
                                                    id="desligarColaborador"
                                                    checked={rolesRH?.desligarColaborador}
                                                />
                                                <Label htmlFor="desligarColaborador">
                                                    Desligar Colaborador
                                                </Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="cadastrarColaborador"
                                                    id="cadastrarColaborador"
                                                    checked={rolesRH?.cadastrarColaborador}
                                                />
                                                <Label htmlFor="cadastrarColaborador">
                                                    Cadastrar colaborador
                                                </Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="deletarDocumento"
                                                    id="deletarDocumento"
                                                    checked={rolesRH?.deletarDocumento}
                                                />
                                                <Label htmlFor="deletarDocumento">
                                                    Deletar documento
                                                </Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="acessoDoc"
                                                    id="acessoDoc"
                                                    checked={rolesRH?.acessoDoc}
                                                />
                                                <Label htmlFor="acessoDoc">Acessar documentos</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="atualizarDados"
                                                    id="atualizarDados"
                                                    checked={rolesRH?.atualizarDados}
                                                />
                                                <Label htmlFor="atualizarDados">Atualizar dados</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="gerarRelatorio"
                                                    id="gerarRelatorio"
                                                    checked={rolesRH?.gerarRelatorio}
                                                />
                                                <Label htmlFor="gerarRelatorio">Gerar relatório</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleRh}
                                                    name="inativarNota"
                                                    id="inativarNota"
                                                    checked={rolesRH?.inativarNota}
                                                />
                                                <Label htmlFor="inativarNota">Inativar nota</Label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        <legend>Permissões do estoque</legend>
                                        <hr/>
                                        <ul className="flex gap-2 flex-col">
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleEstoque}
                                                    name="delegado"
                                                    id="delegadoEstoque"
                                                    checked={rolesEstoque?.delegado}
                                                />
                                                <Label htmlFor="delegadoEstoque">Integrante</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleEstoque}
                                                    name="solicitacoes"
                                                    id="solicitacoes"
                                                    checked={rolesEstoque?.solicitacoes}
                                                />
                                                <Label htmlFor="solicitacoes">Solicitações</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleEstoque}
                                                    name="controleItem"
                                                    id="controleItem"
                                                    checked={rolesEstoque?.controleItem}
                                                />
                                                <Label htmlFor="controleItem">Controle dos itens</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleEstoque}
                                                    name="movimentacoes"
                                                    id="movimentacoes"
                                                    checked={rolesEstoque?.movimentacoes}
                                                />
                                                <Label htmlFor="movimentacoes">Movimentações</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleEstoque}
                                                    name="itensAlertas"
                                                    id="itensAlertas"
                                                    checked={rolesEstoque?.itensAlertas}
                                                />
                                                <Label htmlFor="itensAlertas">Itens de alerta</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleEstoque}
                                                    name="desativarItem"
                                                    id="desativarItem"
                                                    checked={rolesEstoque?.desativarItem}
                                                />
                                                <Label htmlFor="desativarItem">Desativar itens</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleEstoque}
                                                    name="darBaixa"
                                                    id="darBaixa"
                                                    checked={rolesEstoque?.darBaixa}
                                                />
                                                <Label htmlFor="darBaixa">
                                                    Dar baixa nas solicitações
                                                </Label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        <legend>Permissões diversas</legend>
                                        <hr/>
                                        <ul className="flex gap-2 flex-col">
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleDiversos}
                                                    name="telefonia"
                                                    id="telefonia"
                                                    checked={rolesDiversos?.telefonia}
                                                />
                                                <Label htmlFor="telefonia">Liberar portão</Label>
                                            </li>
                                            <li className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="checked:w-4 checked:h-4 w-4 h-4"
                                                    onChange={alterRoleDiversos}
                                                    name="trocaRamal"
                                                    id="trocaRamal"
                                                    checked={rolesDiversos?.trocaRamal}
                                                />
                                                <Label htmlFor="trocaRamal">Trocar ramal (Control ID)</Label>
                                            </li>


                                        </ul>
                                    </div>
                                </div>
                                <div className="absolute right-6 bottom-6 flex gap-5">
                                    <Button type="button" onClick={() => redefinirRoles()}>
                                        Redefinir
                                    </Button>
                                    <Button onClick={() => atualizarRoles()} type="button">
                                        Salvar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ContainerSystem>
        </>
    );
}

