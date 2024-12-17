import ListColaboradoresAtivos from "@/components/diversos/essential/ListColaboradoresAtivos";
import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import {useForm} from "react-hook-form";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import React, {ChangeEvent, useContext, useEffect} from "react";
import {useQuery} from "react-query";
import {MainContext} from "@/provider/main-provider";
import axios from "axios";
import {ConfigMatriculaRhModels, EmpresaColaboradorModel, RegisterDTO} from "@/lib/models";
import {pageSelectProps, pageSelectRhGlobal, stateLoundingGlobal} from "@/lib/globalStates";
import {Search} from "lucide-react";

export default function Cadastrar() {

    const {register, handleSubmit, getValues, setValue, reset} = useForm()


    const {host, configToken} = useContext(MainContext)
    const displayLounding = stateLoundingGlobal((state: any) => state)
    const {data: empresas} = useQuery({
        queryKey: ["empresas"],
        queryFn: async () => {
            const response: EmpresaColaboradorModel[] = await axios.get(`${host}/colaborador/find/empresas`, configToken).then((reponse) => reponse.data)
            return response;
        },
        enabled: !!host && !!configToken,
    })
    const {data: setores} = useQuery({
        queryKey: ["setores"],
        queryFn: async () => {
            const response: EmpresaColaboradorModel[] = await axios.get(`${host}/colaborador/find/setores`, configToken).then((reponse) => reponse.data)
            return response;
        },
        enabled: !!host && !!configToken,
    })
    const selectPage = pageSelectRhGlobal<pageSelectProps>((state) => state)
    const {data: matriculas} = useQuery({
        queryKey: ["matriculas"],
        queryFn: async () => {
            return await axios.get(`${host}/rh/find/num/matricula`, configToken).then(value => {
                const matriculas: ConfigMatriculaRhModels = value.data
                return matriculas
            })
        }
    })


    const cadastrarColaborador = async (data: any) => {
        displayLounding.setDisplayLounding();
        const cadastro: RegisterDTO = {
            ...data,
            empresa: JSON.parse(data.empresa),
            setor: JSON.parse(data.setor)
        }
        await axios.post(`${host}/auth/register`, cadastro, configToken).then(async (response) => {
            displayLounding.setDisplaySuccess(response.data);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            reset()
            selectPage.setPage("listaColaboradores")
            displayLounding.setDisplayReset()
        }).catch(async (err) => {
            displayLounding.setDisplayFailure(err.response.data);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            displayLounding.setDisplayReset()
        })
    }

    useEffect(() => {
        const data = new Date().toLocaleDateString();
        const dataSeparada = data.split("/")
        const numeroAleatorio = Math.round(Math.random() * 99)
        setValue("login", dataSeparada[0] + dataSeparada[1] + dataSeparada[2] + numeroAleatorio);
    }, [])


    return (
        <>
            <ScrollArea className="w-full">
                <form onSubmit={handleSubmit(cadastrarColaborador)}
                      className="w-full h-full p-5  scale-[95%] absolute overflow-auto ">
                    <div className="gap-5 w-full h-full flex flex-col items-center">
                        <div className="w-[60%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                            <span className="text-xs">Informações pessoais</span>
                            <div className="flex gap-3 w-full justify-center">
                                <LabelInputPadrao.Root name={"nomeCompleto"} title={"Nome completo"} width={80}
                                                       register={register}
                                                       classNames="w-full" required/>
                                <LabelInputPadrao.Root name={"login"} title={"Login"} width={30}
                                                       register={register}
                                                       classNames="w-full" disabled/>
                            </div>
                            <div className="flex gap-3 w-full justify-center">
                                <LabelInputPadrao.Root name={"email"} title={"E-mail"} width={50}
                                                       register={register}
                                                       classNames="w-full" type="email" required/>
                                <LabelInputPadrao.Root name={"nCelular"} title={"Numero do celular"} width={50}
                                                       register={register}
                                                       classNames="w-full" type="text" required/>
                            </div>
                            <div className="flex gap-3 w-full justify-center">
                                <LabelInputPadrao.Root name={"cpf"} title={"CPF"} width={50}
                                                       register={register}
                                                       classNames="w-full" type="text"/>
                                <LabelInputPadrao.Root name={"dataNascimento"} title={"Data de nascimento"} width={50}
                                                       register={register}
                                                       classNames="w-full" type="date" required/>
                            </div>
                        </div>
                        <div
                            className="w-[60%] p-5 flex flex-col gap-3 relative  bg-[var(--color-tec)] border-b border-slate-600">
                            <span className="text-xs">Endereço</span>
                            <div className="flex gap-3 w-full justify-center">
                                <LabelInputPadrao.Root
                                    name={"logradouro"}
                                    title={"Endereço"}
                                    width={100}
                                    register={register}
                                    classNames="w-full"
                                    type="text"
                                    readOnly
                                />
                            </div>
                            <div className="flex gap-3 w-full justify-center">
                                <LabelInputPadrao.Root
                                    name={"cep"}
                                    title={"CEP"}
                                    width={50}
                                    change={async (e: ChangeEvent<any>) => {
                                        await axios
                                            .get(
                                                `https://viacep.com.br/ws/${
                                                    e.target.value
                                                }/json/`,
                                            )
                                            .then((response) => {
                                                setValue("bairro", response.data.bairro);
                                                setValue("localidade", response.data.localidade);
                                                setValue("logradouro", response.data.logradouro);
                                                setValue("uf", response.data.uf);
                                            })
                                            .catch((err) => {
                                                setValue("bairro", "");
                                                setValue("localidade", "");
                                                setValue("logradouro", "");
                                                setValue("uf", "");
                                            });
                                    }}
                                    register={register}
                                    classNames="w-full"
                                    required
                                />
                                <LabelInputPadrao.Root
                                    name={"bairro"}
                                    title={"Bairro"}
                                    width={50}
                                    register={register}
                                    classNames="w-full"
                                    type="text"
                                    readOnly
                                />
                            </div>
                            <div className="flex gap-3 w-full justify-center">
                                <LabelInputPadrao.Root
                                    name={"localidade"}
                                    title={"Localidade"}
                                    width={50}
                                    register={register}
                                    classNames="w-full"
                                    type="text"
                                    readOnly
                                />
                                <LabelInputPadrao.Root
                                    name={"uf"}
                                    title={"UF"}
                                    width={50}
                                    register={register}
                                    classNames="w-full"
                                    type="text"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="w-[60%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                            <span className="text-xs">Informações de contrato</span>
                            <div className="flex gap-3 w-full justify-center">
                                <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                    <Label htmlFor="tipo">Tipo de contrato</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register("tipo")}
                                        name="tipo"
                                        required
                                    >
                                        <option value="">Escolha</option>
                                        <option value="CLT">CLT</option>
                                        <option value="ESTAGIARIO">Estagiario</option>
                                        <option value="TERCEIRIZADO">Terceirizado</option>
                                    </select>
                                </div>
                                <LabelInputPadrao.Root name={"dataAdmissao"} title={"Data de inicio"} width={50}
                                                       register={register}
                                                       classNames="w-full" type="date"/>
                            </div>
                            <div className="flex gap-3 w-full justify-center">
                                <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                    <Label htmlFor="empresa">Empresa</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register("empresa")}
                                        name="empresa"
                                        required
                                    >
                                        <option value="">Escolha</option>
                                        {empresas?.map((empresa) => {
                                            return (
                                                <option key={empresa.id}
                                                        value={JSON.stringify(empresa)}>{empresa.nome}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                    <Label htmlFor="setor">Setor</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register("setor")}
                                        name="setor"
                                        required
                                    >
                                        <option value="">Escolha</option>
                                        {setores?.map((setor) => {
                                            return (
                                                <option key={setor.id}
                                                        value={JSON.stringify(setor)}>{setor.nome}</option>
                                            )
                                        })}
                                    </select>
                                </div>

                            </div>

                            <LabelInputPadrao.Root name={"emailCorporativo"} title={"Email corporativo"} width={100}
                                                   register={register}
                                                   classNames="w-full" type="email" required/>

                        </div>
                        <div className="w-[60%] flex gap-3 rounded-md">
                            <Button>
                                Cadastrar
                            </Button>
                        </div>
                    </div>
                </form>
            </ScrollArea>

        </>
    )
}