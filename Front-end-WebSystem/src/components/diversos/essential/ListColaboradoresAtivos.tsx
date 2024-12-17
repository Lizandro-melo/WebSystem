import {
    AcessoModel,
    InfoColaborador,
    ResponseSocketSolicitacaoTiDTO,
    SolicitcaoTiDTO,
} from "@/lib/models";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {
    alterNomeCompletoParaNomeSobrenome,
    cn,
    formatDateTimeUser,
} from "@/lib/utils";
import React, {
    ChangeEvent,
    ChangeEventHandler,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import {useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {MainContext} from "@/provider/main-provider";
import {
    colaboradorSelectGlobal,
    colaboradorSelectGlobalProps,
    roleColaboradorSelectGlobal,
    roleColaboradorSelectGlobalProps,
    stateBarGlobalprops,
    stateListColaboradorBarGlobal,
    stateNavBarGlobal,
} from "@/lib/globalStates";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";

type ListColaboradoresAtivosProps = {
    tipoSelect?: boolean;
};

type filtroProps = {
    nome: string;
    tipo: string;
};

export default function ListColaboradoresAtivos({
                                                    tipoSelect,
                                                }: ListColaboradoresAtivosProps) {
    const queryClient = useQueryClient();
    const {host, configToken, searchParams} = useContext(MainContext);
    const roleSelect =
        roleColaboradorSelectGlobal<roleColaboradorSelectGlobalProps>(
            (state: any) => state,
        );
    const colaboradorSelect =
        colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
            (state: any) => state,
        );
    const [filtro, setFiltro] = useState<filtroProps>({
        tipo: "CLT",
        nome: "",
    });

    const fetchColaboradores = async (): Promise<InfoColaborador[]> => {
        try {
            const response = await axios.get(
                `${host}/colaborador/find/colaboradores?nome=${filtro?.nome}&tipo=${filtro?.tipo}`,
                configToken,
            );
            return response.data;
        } catch (error) {
            return [];
        }
    };

    const {data: colaboradores, refetch: reFetchColaboradoresAtivos} = useQuery(
        {
            queryKey: ["colaboradores_list", filtro],
            queryFn: fetchColaboradores,
            enabled: !!filtro && !!configToken,
        },
    );
    const state = stateListColaboradorBarGlobal<stateBarGlobalprops>(
        (state: any) => state,
    );

    const joinAcesso = async (colaborador: InfoColaborador | null) => {
        colaboradorSelect.setColaborador(colaborador);
        queryClient.setQueryData(["colaboradores_list"], (input: any) => {
            return colaboradores!.map((item, i) => {
                if (item.fkAuth === colaborador?.fkAuth) {
                    item.select = true
                } else {
                    item.select = false
                }
                return item
            })
        })
        await axios
            .get(
                `${host}/colaborador/find/roles?id=${colaborador?.fkAuth}`,
                configToken,
            )
            .then((response) => {
                const role: AcessoModel = response.data;
                roleSelect.setSelect(role);
            });
    };

    const alterFilter = (e: ChangeEvent<any>) => {
        const {name, value} = e.target;
        setFiltro((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        reFetchColaboradoresAtivos();
    }, [filtro, queryClient]);

    return (
        <>
            <div
                onClick={() => {
                    if (!state.stateNavBar) {
                        state.setBool(true);
                    }
                }}
                className={cn(
                    "h-full w-[30%] rounded-l-md transition-all border-y border-l border-slate-600",
                    !state.stateNavBar && "!w-[13%]",
                )}
            >
                <div className="p-5 w-full h-[10%]  bg-[var(--color-tec)] border-b border-slate-600">
                    <h1 className={cn("text-xs", !state.stateNavBar && "text-center")}>
                        Lista de colaboradores
                    </h1>
                </div>
                <hr/>
                <div className="py-3 w-full h-[90%] rounded-bl-md bg-[var(--color-tec)] ">
                    <div className="w-full h-full relative rounded-md overflow-y-scroll scrowInvivel">
                        <div className="absolute  flex flex-col  w-full ">
                            {state.stateNavBar && (
                                <span
                                    className="sticky border-b border-slate-600 top-0 w-full z-50 h-full flex flex-col gap-2 bg-[var(--color-tec)] px-2 py-2">
                  <>
                    <Input
                        onChange={alterFilter}
                        value={filtro?.nome}
                        name="nome"
                        placeholder="Nome sobrenome"
                        className="border focus-visible:ring-0"
                    />
                    <Search className="absolute top-[15px] w-4 stroke-stone-500 right-[10px]"/>
                  </>
                                    {tipoSelect && (
                                        <>
                                            <select
                                                onChange={alterFilter}
                                                defaultValue={filtro?.tipo}
                                                name="tipo"
                                                className="border focus-visible:ring-0    lex h-10 w-full rounded-md !border-stone-600 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="TODOS" selected>
                                                    Todos
                                                </option>
                                                <option value="CLT">CLT</option>
                                                <option value="ESTAGIARIO">Estagiario</option>
                                                <option value="TERCEIRIZADO">Terceirizado</option>
                                                <option value="DESLIGADO">Desligado</option>
                                            </select>
                                        </>
                                    )}
                </span>
                            )}
                            {colaboradores
                                ?.sort((a, b) => {
                                    return a.nomeCompleto! >= b.nomeCompleto! ? 1 : -1;
                                })
                                .map((colaborador: InfoColaborador, i) => {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => joinAcesso(colaborador)}
                                            title={alterNomeCompletoParaNomeSobrenome(
                                                colaborador.nomeCompleto,
                                            )}
                                            className={cn(
                                                "bg-[var(--color-tec)] px-2 h-[80px] relative flex items-center hover:bg-[var(--color-tec-hover)] justify-between transition-all w-full active:scale-95 border-b border-slate-600", colaborador.select && "outline  outline-offset-[-4px] "
                                            )}
                                        >
                                            <Avatar>
                                                <AvatarImage
                                                    src={
                                                        !colaborador.dirFoto
                                                            ? "https://placehold.co/600?text=Foto"
                                                            : `.${colaborador.dirFoto}`
                                                    }
                                                    alt="fotoColaborador"
                                                />
                                            </Avatar>
                                            {state.stateNavBar && (
                                                <>
                          <span className="text-xs whitespace-nowrap">
                            {alterNomeCompletoParaNomeSobrenome(
                                colaborador.nomeCompleto,
                            )}
                          </span>
                                                    <span className="smallSpan absolute right-2 bottom-1">
                            #{colaborador.fkAuth}
                          </span>
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
