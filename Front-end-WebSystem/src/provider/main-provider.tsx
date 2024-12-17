import {createContext, ReactNode, useEffect, useState} from "react";
import axios from "axios";
import {destroyCookie, parseCookies, setCookie} from "nookies";
import Router from "next/router";
import {stateLoundingGlobal} from "@/lib/globalStates";
import {AcessoModel, InfoColaborador} from "@/lib/models";
import {ReadonlyURLSearchParams, useSearchParams} from "next/navigation";
import {NotifyProvider} from "./NotifyContext";
import BackgroundSystem from "@/components/container/background-system";
import DialogAlertGlobal from "@/components/diversos/essential/DialogAlertGlobal";
import LoudingDisplay from "@/components/diversos/essential/louding-display";
import {QueryClient, QueryClientProvider} from "react-query";

// Tipo responsavel por controlar o que deve sair do Context
type MainContextType = {
    user: InfoColaborador | null;
    acessos: AcessoModel | null;
    isAuthenticated: boolean;
    singIn: (dadosLogin: any) => void;
    disconnect: () => void;
    host: string;
    searchParams: ReadonlyURLSearchParams;
    configToken: object | undefined;
    alterPass: boolean | null;
    themes: boolean | undefined;
    setThemes: (themes: boolean) => void;
};

// Informações que são retornadas do back-end ao logar
type ResponseSingIn = {
    token: string;
    user: InfoColaborador;
    acessos: AcessoModel;
    alterPass: boolean;
};

// Informações que são retornadas do back-end ao re-autenticar um usuario
type ResponseRevalidate = {
    user: InfoColaborador;
    acessos: AcessoModel;
    alterPass: boolean;
};

export const MainContext = createContext({} as MainContextType);

export function MainProvider({children}: { children: ReactNode }) {
    const host = "http://localhost:8081"; // Ativar essa variavel apenas em caso de teste localhost do backend. Lembrando que deve se comentar o "host" abaixo para entrar em vigor
    // const host = "https://qualityserver12:8081"; // host do backend em produção
    const [user, setUser] = useState<InfoColaborador | null>(null); // Estado de informações do usuario
    const [themes, setThemes] = useState<boolean>(); // Estado de tema do sistema, True -> Escuro | False -> Claro
    const [acessos, setAcessos] = useState<AcessoModel | null>(null); // Estado de acessos do usuario
    const [alterPass, setAlterPass] = useState<boolean | null>(null); // Estado de alteração de senha
    const isAuthenticated = !!user; // Variavel responsavel por retornar se o user está autenticado ou não
    const displayLounding = stateLoundingGlobal((state: any) => state); // Estado da tela de carregamento, utilizando a estrategia de globalstate
    const searchParams = useSearchParams(); // Hock para dar get nas variaveis passadas pela a url do navegador, muito util para ser usado para os filtros das tabelas (Não está sendo muito utlizando)
    const [configToken, setConfigToken] = useState<any>(); // Estado que armazena o header de configuração das requisições, relacinada a autenticação
    const queryClient = new QueryClient();

    // Effect de verificação de thema amazenadas nos cookies
    useEffect(() => {
        const {"themes-quality": themes} = parseCookies(); // Pega o tema dos cookies
        if (themes) {
            document.documentElement.classList.add("dark");
            // // verifica se existe as configurações nos cookies
            // if (themes === "dark") {
            //     document.documentElement.classList.add("dark");
            //     setThemes(true);
            // } else {
            //     setThemes(false);
            //     document.documentElement.classList.remove("dark");
            // }
        } else {
            // caso não ele configura como padrão white
            setCookie(undefined, "themes-quality", "dark", {
                maxAge: 60 * 60 * 24 * 30,
            });
            // document.documentElement.classList.remove("dark");
        }
    }, [themes]);

    // Effect de verificação de token
    useEffect(() => {
        displayLounding.setDisplayLounding(); // Start a tela de carregamento
        const {"quality-token": token} = parseCookies(); // Pega o token dos cookies
        if (token) {
            // verifica se existe
            setConfigToken({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); // Caso exista, aqui eu deixo pronto o header de autenticação das requisições

            axios
                .get(`${host}/auth/revalidate?token=${token}`) // faço a validação do token com o backend
                .then(async (response) => {
                    displayLounding.setDisplaySuccess("Validado!"); // Ao validar mostro a mensagem de "Validado" da tela de carregamento
                    const {data}: { data: ResponseRevalidate } = response; // Capturo o response e já setto o tipo do retorno, já o JS não faz essa integração com o JAVA
                    setCookie(undefined, "quality-user", JSON.stringify(data.user), {
                        // Pego as informações do usuario e coloco nos cookies
                        maxAge: 60 * 60 * 24 * 30, // 30 dia
                    });
                    setCookie(
                        undefined,
                        "quality-acessos",
                        JSON.stringify(data.acessos),
                        {
                            // Pego as informações de acesso do usuario
                            maxAge: 60 * 60 * 24 * 30, // 30 dia
                        },
                    );

                    // Setto todas as informações do response nos estados do Context, para facilitar o acesso dessas informações com outros componentes
                    setUser(data.user);
                    setAcessos(data.acessos);
                    setAlterPass(data.alterPass);
                    // Rapidamente desligo a tela de carregamento
                    displayLounding.setDisplayReset();
                    // verifyPermissionNotify();
                    if (data.alterPass) {
                        Router.push("/alterpass");
                        return;
                    }
                    Router.push("/home");
                })
                .catch(async () => {
                    displayLounding.setDisplayFailure("Efetue o login novamente!");
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    disconnect();
                    displayLounding.setDisplayReset();
                });
        } else {
            displayLounding.setDisplayReset();
            disconnect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Função de efetur o login
    const singIn = async (dadosLogin: { login: string; password: string }) => {
        displayLounding.setDisplayLounding(); // Ativo a tela de carregamento

        // Efetuo a requisição de login, pegando as informações que vem do componente "FormLogin"
        await axios
            .post(`${host}/auth/login`, {
                login: dadosLogin.login.toLowerCase(),
                password: dadosLogin.password,
            })
            .then(async (response) => {
                const {data}: { data: ResponseSingIn } = response;
                setConfigToken({
                    headers: {
                        Authorization: `Bearer ${data.token}`,
                    },
                });

                // Setto todas as informações do response nos cookies e no estado do context
                displayLounding.setDisplaySuccess("Logado com sucesso!");
                setCookie(undefined, "quality-token", data.token, {
                    maxAge: 60 * 120 * 24,
                });
                setCookie(undefined, "quality-user", JSON.stringify(data.user), {
                    maxAge: 60 * 120 * 24,
                });
                setCookie(undefined, "quality-acessos", JSON.stringify(data.acessos), {
                    maxAge: 60 * 120 * 24,
                });
                setCookie(undefined, "quality-itens-selecionados", JSON.stringify([]), {
                    maxAge: 60 * 120 * 24,
                });
                setUser(data.user);
                setAcessos(data.acessos);
                setAlterPass(data.alterPass);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                // Caso o usuario tenha no banco de dados a informação de reset de senha, ele será levado para a tela de alteração de senha
                if (data.alterPass) {
                    Router.push("/alterpass");
                    return;
                }
                Router.push("/home");
            })
            .catch(async () => {
                displayLounding.setDisplayFailure(
                    "Nome do usuário ou senha incorreto. Tente novamente.",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            });
    };

    // Função de desconectar o usuario
    const disconnect = () => {
        destroyCookie(undefined, "quality-token");
        destroyCookie(undefined, "quality-user");
        destroyCookie(undefined, "quality-acessos");
        localStorage.clear();
        sessionStorage.clear();
        // Ao limpar os dados, o usuario é levado para a tela de login
        Router.push("/");
    };

    // Essa função solicita gerar notificações ao usuario.
    const verifyPermissionNotify = () => {
        displayLounding.setDisplayFailure("Por favor, permita as notificações!");
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then((per) => {
                if (per === "granted") {
                    displayLounding.setDisplayReset();
                }
            });
        } else {
            displayLounding.setDisplayReset();
        }
    };

    return (
        <MainContext.Provider
            value={{
                user,
                acessos,
                isAuthenticated,
                singIn,
                disconnect,
                host,
                searchParams,
                configToken,
                alterPass,
                themes,
                setThemes,

            }}
        >
            <QueryClientProvider client={queryClient}>
                <BackgroundSystem/>
                <DialogAlertGlobal/>
                <LoudingDisplay/>
                <NotifyProvider>{children}</NotifyProvider>
            </QueryClientProvider>
        </MainContext.Provider>
    );
}
