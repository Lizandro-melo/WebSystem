import {cn, formatarDataComum} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Plus, Search, Trash} from "lucide-react";
import {Input} from "@/components/ui/input";
import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import axios from "axios";
import {Label} from "@/components/ui/label";
import {
    ContaBancariaColaboradorModel,
    ContatoColaboradorModel,
    EmpresaColaboradorModel,
    InfoColaboradorCompletoDTO
} from "@/lib/models";
import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {
    stateAlertDialogPromoverGlobalProps, stateLoundingGlobal, stateLoundingGlobalProps,
    stateModalPromoverGlobal
} from "@/lib/globalStates";
import {MainContext} from "@/provider/main-provider";
import {useMutation, useQuery} from "react-query";
import {useForm} from "react-hook-form";
import ContainerSystem from "@/components/container/container-system";


export default function ConfigPerfil() {

    const stateAlertPromover = stateModalPromoverGlobal<stateAlertDialogPromoverGlobalProps>((state) => state)
    const {host, acessos, user, configToken} = useContext(MainContext)
    const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>((state: any) => state)
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
    const {data: colaborador, refetch} = useQuery({
        queryKey: "infoColaFull",
        queryFn: async () => {
            return await axios.get(`${host}/colaborador/find/completo?id=${user?.fkAuth}`, configToken).then(async (response) => {
                const colaborador: InfoColaboradorCompletoDTO = response.data
                reset(colaborador);
                setContatos(colaborador.contatos)
                setContasBancarias(colaborador.contasBancarias)
                setFotoColaborador(colaborador.infoPessoais.dirFoto)
                return colaborador
            })
        },
        enabled: !!user?.fkAuth && !!configToken
    })
    const {register, formState, handleSubmit, setValue, reset, setFocus, getValues} = useForm({})
    const [contatos, setContatos] = useState<ContatoColaboradorModel[]>()
    const [contasBancarias, setContasBancarias] = useState<ContaBancariaColaboradorModel[]>()
    const [fotoColaborador, setFotoColaborador] = useState<string>()
    const [dataDeLancamento, setDataDeLancamento] = useState()


    const {mutateAsync: promoverColaborador} = useMutation({
        mutationFn: async () => {
            displayLounding.setDisplayLounding();
            await axios.get(`${host}/colaborador/update/promover?id=${colaborador?.infoPessoais.fkAuth}&data=${dataDeLancamento}`, configToken).then(async (response) => {
                displayLounding.setDisplaySuccess(response.data)
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset()
                refetch()
            }).catch(async (err) => {
                displayLounding.setDisplayFailure(err.response?.data)
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset()
            })
        }
    })

    const {mutateAsync: reativarColaborador} = useMutation({
        mutationFn: async () => {
            displayLounding.setDisplayLounding();
            await axios.get(`${host}/colaborador/update/reativar?id=${colaborador?.infoPessoais.fkAuth}&data=${dataDeLancamento}`, configToken).then(async (response) => {
                displayLounding.setDisplaySuccess(response.data)
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset()
                refetch()
            }).catch(async (err) => {
                displayLounding.setDisplayFailure(err.response?.data)
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset()
            })
        }
    })

    const atualizarCadastro = useCallback(async (data: any) => {
        displayLounding.setDisplayLounding()
        const infomacoesColaborador: InfoColaboradorCompletoDTO = {
            ...data,
            authColaborador: null,
            contasBancarias: contasBancarias,
            contatos: contatos,
            infoPessoais: {
                ...data.infoPessoais,
                dirFoto: fotoColaborador
            }
        }
        axios.put(`${host}/colaborador/update/dados`, infomacoesColaborador, configToken).then(async (response) => {
            displayLounding.setDisplaySuccess(response.data)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            displayLounding.setDisplayReset()
            refetch()
        }).catch(async (err) => {
            displayLounding.setDisplayFailure(err.response?.data)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            displayLounding.setDisplayReset()
        })
    }, [configToken, contasBancarias, contatos, displayLounding, fotoColaborador, host, refetch])

    const updateFile = async (e: ChangeEvent<HTMLInputElement>) => {

        const formData = new FormData();
        formData.append("file", e.target.files![0]);
        formData.append("dir", "C:/GrupoQualityWeb/outv2/assets/fotoColaborador");

        try {
            const response = await axios.post(`${host}/colaborador/update/foto`, formData, configToken).then(response => response);
            setFotoColaborador(`./assets/fotoColaborador/${response.data}`);
        } catch (error) {
            throw new Error("Falha ao enviar o arquivo");
        }

    }

    useEffect(() => {
        if (user?.fkAuth) {
            refetch()
            if (user?.cep) {
                axios.get(`https://viacep.com.br/ws/${user.cep}/json/`).then((response) => {
                    setValue("bairro", response.data.bairro)
                    setValue("localidade", response.data.localidade)
                    setValue("logradouro", response.data.logradouro)
                    setValue("uf", response.data.uf)
                })
            } else {
                setValue("bairro", "")
                setValue("localidade", "")
                setValue("logradouro", "")
                setValue("uf", "")
            }
        }
    }, [user?.fkAuth])

    const buscarDatadeDesligamento = () => {
        let data = ""
        switch (colaborador?.infoPessoais.tipo) {
            case "CLT":
                data = colaborador.infoCLT.dataDemissao
                break
            case "ESTAGIARIO":
                data = colaborador.infoEstagiario.dataDemissao
                break
            case "TERCEIRIZADO":
                data = colaborador.infoMEI.dataDemissao
                break
        }

        return data
    }

    const alterContato = (e: ChangeEvent<any>, i: number) => {
        const {name, value} = e.target;

        setContatos((prevState) => {
            return prevState?.map((item, index) => {
                if (index === i) {
                    switch (name) {
                        case "tipo":
                            item.tipo = value;
                            break;
                        case "email":
                            item.email = value;
                            break;
                        case "nuCelular":
                            item.nuCelular = value;
                        case "nuFixo":
                            item.nuFixo = value;
                            break;
                        case "nome":
                            item.nome = value;
                            break;
                    }
                }
                return item;
            });
        });
    };

    const alterConta = (e: ChangeEvent<any>, i: number) => {
        const {name, value} = e.target;

        setContasBancarias(prevState => {
            return prevState?.map((item, index) => {
                if (index === i) {
                    switch (name) {
                        case "numeroConta":
                            item.numeroConta = value
                            break
                        case "numeroAgencia":
                            item.numeroAgencia = value
                            break
                        case "nomeBanco":
                            item.nomeBanco = value
                    }
                }
                return item
            })
        })
    }

    return (
        <ContainerSystem>
            <form onSubmit={handleSubmit(atualizarCadastro)}
                  className="w-full h-full p-5 absolute overflow-auto">
                <div className="gap-5 w-full h-full flex flex-col items-center">
                    <div
                        className="w-[80%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                        <span className="text-xs">Informações pessoais</span>
                        {!colaborador?.authColaborador.status && (
                            <span
                                className="text-sm">{`Este colaborador foi desligado no dia: ${formatarDataComum(buscarDatadeDesligamento())}`}</span>
                        )}
                        <div className="flex gap-3 w-full justify-center">
                            <div className="w-[35%] h-full flex items-center justify-center">
                                {!fotoColaborador && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className=" rounded-full h-[100px] w-[100px] flex items-center justify-center flex-none ">
                                        <Plus className="w-3 absolute z-[10]"/>
                                        <Input type="file"
                                               onChange={updateFile}
                                               className="text-white z-[20] cursor-pointer bg-transparent file:hidden w-full h-full border border-none"/>

                                    </Button>
                                )}
                                {fotoColaborador && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className=" rounded-full h-[100px] w-[100px] flex items-center justify-center flex-none relative">
                                        <Input type="file"
                                               onChange={updateFile}
                                               className="text-white z-[40] cursor-pointer bg-transparent file:hidden w-full h-full border border-none"/>

                                        <img height={100} width={100} src={`.${fotoColaborador}`} alt="Foto importada"
                                             className={" rounded-full z-[10] absolute"}/>

                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3 w-full justify-center">
                            <LabelInputPadrao.Root name={"infoPessoais.nomeCompleto"}
                                                   title={"Nome completo"}
                                                   width={100}
                                                   register={register}
                                                   classNames="w-full" required/>
                        </div>
                        <div className="flex gap-3 w-full justify-center">
                            <LabelInputPadrao.Root name={"infoPessoais.cpf"} title={"CPF"} width={40}
                                                   register={register}
                                                   disabled
                                                   classNames="w-full"/>
                            <LabelInputPadrao.Root name={"infoPessoais.rg"} title={"RG"} width={40}
                                                   register={register}
                                                   disabled
                                                   classNames="w-full" type="text"/>
                            <LabelInputPadrao.Root name={"infoPessoais.pis"} title={"PIS"} width={33}
                                                   register={register}
                                                   disabled
                                                   classNames="w-full" type="text"/>
                        </div>
                        <div className="flex gap-3 w-full justify-center">
                            <LabelInputPadrao.Root name={"infoPessoais.nuCarteira"}
                                                   title={"Nº da cart. de trabalho"}
                                                   width={50}
                                                   register={register}
                                                   disabled
                                                   classNames="w-full" type="text"/>
                            <LabelInputPadrao.Root name={"infoPessoais.dataNascimento"}
                                                   title={"Data de nascimento"}
                                                   width={50}
                                                   register={register}
                                                   classNames="w-full" type="date" required/>
                        </div>
                    </div>
                    <div
                        className="w-[80%] p-5 flex flex-col gap-3 relative  rounded-md  bg-[var(--color-tec)]">
                        <span className="text-xs">Endereço</span>
                        <Button onClick={() => {
                            axios.get(`https://viacep.com.br/ws/${getValues().infoPessoais.cep}/json/`).then((response) => {
                                setValue("bairro", response.data.bairro)
                                setValue("localidade", response.data.localidade)
                                setValue("logradouro", response.data.logradouro)
                                setValue("uf", response.data.uf)
                            }).catch((err) => {
                                setValue("bairro", "")
                                setValue("localidade", "")
                                setValue("logradouro", "")
                                setValue("uf", "")
                            })
                        }} type="button" className="absolute top-2 right-2 h-[35px] flex gap-5"
                                variant="default">
                            <Search className="w-[15px] h-[15px]"/>
                            Buscar endereço
                        </Button>
                        <div className="flex gap-3 w-full justify-center">

                            <LabelInputPadrao.Root name={"logradouro"} title={"Endereço"} width={100}
                                                   register={register}
                                                   disabled
                                                   classNames="w-full" type="text"/>
                        </div>
                        <div className="flex gap-3 w-full justify-center">
                            <LabelInputPadrao.Root name={"infoPessoais.cep"} title={"CEP"} width={50}
                                                   register={register}
                                                   classNames="w-full" required/>
                            <LabelInputPadrao.Root name={"bairro"} title={"Bairro"} width={50}
                                                   register={register}
                                                   disabled
                                                   classNames="w-full" type="text"/>
                        </div>
                        <div className="flex gap-3 w-full justify-center">
                            <LabelInputPadrao.Root name={"localidade"} title={"Localidade"} width={50}
                                                   register={register}
                                                   disabled
                                                   classNames="w-full" type="text"/>
                            <LabelInputPadrao.Root name={"uf"} title={"UF"} width={50}
                                                   register={register}
                                                   disabled
                                                   classNames="w-full" type="text"/>
                        </div>
                    </div>
                    <div
                        className="w-[80%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                        <span className="text-xs">Informações de contrato</span>
                        <div className="flex gap-3 w-full justify-center">
                            <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                <Label htmlFor="tipo">Tipo de contrato</Label>
                                <select
                                    className="flex h-9 w-full rounded-md text-xs border !border-stone-800 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("infoPessoais.tipo")}
                                    required
                                    disabled
                                >
                                    <option value="">Escolha</option>
                                    <option value="CLT">CLT</option>
                                    <option value="ESTAGIARIO">Estagiario</option>
                                    <option value="TERCEIRIZADO">Terceirizado</option>
                                    <option value="DESLIGADO">Desligado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {colaborador?.infoPessoais?.tipo === "CLT" || colaborador?.infoPessoais?.tipo === "ESTAGIARIO" ? (
                        <>
                            {(colaborador.infoEstagiario?.status === false || !colaborador.infoEstagiario) && (
                                <div
                                    className="w-[80%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                                    <span className="text-xs">Informações CLT</span>
                                    <div className="flex gap-3 w-full justify-center">
                                        <LabelInputPadrao.Root name={"infoCLT.dataAdmissao"}
                                                               title={"Data de inicio"}
                                                               width={50}
                                                               disabled
                                                               register={register}
                                                               classNames="w-full" type="date"/>
                                        {colaborador?.infoCLT?.dataDemissao && (
                                            <LabelInputPadrao.Root name={"infoCLT.dataDemissao"}
                                                                   title={"Data de desligamento"}
                                                                   width={50}
                                                                   disabled
                                                                   register={register}
                                                                   classNames="w-full" type="date"/>
                                        )}
                                    </div>
                                    <div className="flex gap-3 w-full justify-center">
                                        <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                            <Label htmlFor="empresa">Empresa</Label>
                                            <select
                                                className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                {...register("infoCLT.empresa.id")}
                                                required
                                                disabled
                                            >
                                                <option value="">Escolha</option>
                                                {empresas?.map((empresa) => {
                                                    return (
                                                        <option key={empresa.id}
                                                                value={empresa.id}>{empresa.nome}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                            <Label htmlFor="setor">Setor</Label>
                                            <select
                                                className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                {...register("infoCLT.setor.id")}
                                                name="setor"
                                                required
                                                disabled
                                            >
                                                <option value="">Escolha</option>
                                                {setores?.map((setor) => {
                                                    return (
                                                        <option key={setor.id}
                                                                value={setor.id}>{setor.nome}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {colaborador.infoEstagiario && (
                                <div
                                    className="w-[80%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                                    <span className="text-xs">Informações Estágiario</span>
                                    <div className="flex gap-3 w-full justify-center">
                                        <LabelInputPadrao.Root name={"infoEstagiario.dataAdmissao"}
                                                               title={"Data de inicio"}
                                                               width={50}
                                                               register={register}
                                                               disabled
                                                               classNames="w-full" type="date"/>
                                        {colaborador?.infoEstagiario?.dataDemissao && (
                                            <LabelInputPadrao.Root name={"infoEstagiario.dataDemissao"}
                                                                   title={"Data de desligamento"}
                                                                   width={50}
                                                                   register={register}
                                                                   disabled
                                                                   classNames="w-full" type="date"/>
                                        )}
                                    </div>
                                    <div className="flex gap-3 w-full justify-center">
                                        <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                            <Label htmlFor="empresa">Empresa</Label>
                                            <select
                                                className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                {...register("infoEstagiario.empresa.id")}
                                                required
                                                disabled
                                            >
                                                <option value="">Escolha</option>
                                                {empresas?.map((empresa) => {
                                                    return (
                                                        <option key={empresa.id}
                                                                value={empresa.id}>{empresa.nome}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                            <Label htmlFor="setor">Setor</Label>
                                            <select
                                                className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                {...register("infoEstagiario.setor.id")}
                                                name="setor"
                                                required
                                                disabled
                                            >
                                                <option value="">Escolha</option>
                                                {setores?.map((setor) => {
                                                    return (
                                                        <option key={setor.id}
                                                                value={setor.id}>{setor.nome}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                </div>

                            )}

                        </>
                    ) : (
                        <>

                            <div
                                className="w-[80%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                                <span className="text-xs">Informações Terceirizado</span>
                                <div className="flex gap-3 w-full justify-center">
                                    <LabelInputPadrao.Root name={"infoMEI.dataAdmissao"}
                                                           title={"Data de inicio"}
                                                           width={50}
                                                           register={register}
                                                           classNames="w-full" type="date"/>
                                    {colaborador?.infoMEI?.dataDemissao && (
                                        <LabelInputPadrao.Root name={"infoMEI.dataDemissao"}
                                                               title={"Data de desligamento"}
                                                               width={50}
                                                               register={register}
                                                               classNames="w-full" type="date"/>
                                    )}
                                </div>
                                <div className="flex gap-3 w-full justify-center">
                                    <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                        <Label htmlFor="empresa">Empresa</Label>
                                        <select
                                            className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            {...register("infoMEI.empresa.id")}
                                            required
                                        >
                                            <option value="">Escolha</option>
                                            {empresas?.map((empresa) => {
                                                return (
                                                    <option key={empresa.id}
                                                            value={empresa.id}>{empresa.nome}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                        <Label htmlFor="setor">Setor</Label>
                                        <select
                                            className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            {...register("infoMEI.setor.id")}
                                            name="setor"
                                            required
                                        >
                                            <option value="">Escolha</option>
                                            {setores?.map((setor) => {
                                                return (
                                                    <option key={setor.id}
                                                            value={setor.id}>{setor.nome}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>

                            </div>

                        </>
                    )}
                    <div
                        className="w-[80%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                        <span className="text-xs">Contatos</span>
                        {contatos?.map((contato, i) => {
                            return (
                                <div
                                    key={contato.id}
                                    className="w-[100%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]"
                                >
                                    <span className="text-xs">{contato.tipo}</span>
                                    <div className="flex relative gap-3 w-full justify-center">
                                        <div className={cn("flex flex-col gap-3 w-[50%]")}>
                                            <Label htmlFor="tipo">Tipo de contato</Label>
                                            <select
                                                className="flex h-9 w-full rounded-md text-xs border !border-stone-800 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                name="tipo"
                                                value={contato.tipo}
                                                onChange={(e) => alterContato(e, i)}
                                                required
                                            >
                                                <option value="">Escolha</option>
                                                <option value="PESSOAL">Pessoal</option>
                                                <option value="EMERGENCIA">Emergencia</option>
                                            </select>
                                        </div>
                                        <LabelInputPadrao.Root
                                            name={"email"}
                                            title={"E-mail"}
                                            width={50}
                                            value={contato.email}
                                            change={(e) => alterContato(e, i)}
                                            classNames="w-full"
                                        />
                                        <LabelInputPadrao.Root
                                            required
                                            name={"nome"}
                                            title={"Nome do contato"}
                                            width={50}
                                            value={contato.nome}
                                            change={(e) => alterContato(e, i)}
                                            classNames="w-full"
                                        />
                                        <Button
                                            onClick={() => {
                                                setContatos((prevState) => {
                                                    return prevState?.filter(
                                                        (contatos, index) => i !== index,
                                                    );
                                                });
                                            }}
                                            type="button"
                                            className="absolute -top-8 right-2 w-[35px] h-[35px]"
                                            variant="destructive"
                                        >
                                            <Trash className="w-[15px] h-[15px] absolute"/>
                                        </Button>
                                    </div>
                                    <div className="flex gap-3 w-full justify-center">
                                        <LabelInputPadrao.Root
                                            name={"nuCelular"}
                                            title={"Nº Celular"}
                                            width={50}
                                            value={contato.nuCelular}
                                            change={(e) => alterContato(e, i)}
                                            classNames="w-full"
                                            required
                                        />
                                        <LabelInputPadrao.Root
                                            name={"nuFixo"}
                                            title={"Nº Fixo"}
                                            width={50}
                                            value={contato.nuFixo}
                                            change={(e) => alterContato(e, i)}
                                            classNames="w-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex gap-3 w-full justify-center">
                            <Button
                                onClick={() => {
                                    setContatos((prevState) => {
                                        const novaConta: ContatoColaboradorModel = {
                                            colaboradorReferent: user!,
                                        };
                                        return [...prevState!, novaConta];
                                    });
                                }}
                                type="button"
                                variant="outline"
                            >
                                <Plus/>
                                Adicionar
                            </Button>
                        </div>
                    </div>
                    <div
                        className="w-[80%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                        <span className="text-xs">Contas bancarias</span>
                        {contasBancarias?.map((contas, i) => {
                            return (
                                <div key={contas.id}
                                     className="w-[100%] p-5 flex flex-col gap-3  rounded-md  bg-[var(--color-tec)]">
                                    <span className="text-xs">Conta: {contas.id}</span>
                                    <div className="flex gap-3 w-full justify-center relative">
                                        <LabelInputPadrao.Root name={"nomeBanco"} title={"Nome do banco"}
                                                               width={50}
                                                               value={contas.nomeBanco}
                                                               change={(e) => alterConta(e, i)}
                                                               classNames="w-full" required/>
                                        <LabelInputPadrao.Root name={"numeroConta"} title={"Nº da conta"}
                                                               width={50}
                                                               change={(e) => alterConta(e, i)}
                                                               value={contas.numeroConta}
                                                               classNames="w-full" required/>
                                        <LabelInputPadrao.Root name={"numeroAgencia"}
                                                               title={"Nº da agencia"}
                                                               change={(e) => alterConta(e, i)}
                                                               value={contas.numeroAgencia} width={50}
                                                               classNames="w-full" required/>
                                        <Button type="button" onClick={() => {
                                            setContasBancarias((prevState) => {
                                                return prevState?.filter((contaReferent, index) => i !== index)
                                            })
                                        }} className="absolute -top-8 right-2 w-[35px] h-[35px]"
                                                variant="destructive">
                                            <Trash className="w-[15px] h-[15px] absolute"/>
                                        </Button>
                                    </div>

                                </div>
                            )
                        })}
                        <div className="flex gap-3 w-full justify-center">
                            <Button type="button" onClick={() => {
                                setContasBancarias((prevState) => {
                                    const novaConta: ContaBancariaColaboradorModel = {
                                        colaboradorReferent: user!
                                    }
                                    return [...prevState!, novaConta]
                                })
                            }} variant="outline">
                                <Plus/>
                                Adicionar
                            </Button>
                        </div>
                    </div>

                    <div className="w-[80%] flex gap-3 rounded-md pb-10">
                        <Button type="submit">
                            Atualizar
                        </Button>
                        {(colaborador?.infoPessoais.tipo === "ESTAGIARIO") && (
                            <Button type="button"
                                    onClick={() => stateAlertPromover.setAlert("Promover estagiario", "Atenção está ação é definitiva!", promoverColaborador)}>
                                Promover
                            </Button>
                        )}
                        <Button type="button" onClick={async () => {
                            displayLounding.setDisplayLounding();
                            displayLounding.setDisplaySuccess("Dados restaurados")
                            refetch()
                            await new Promise((resolve) => setTimeout(resolve, 2000));
                            displayLounding.setDisplayReset()

                        }}>
                            Restaurar dados
                        </Button>


                    </div>
                </div>

            </form>
        </ContainerSystem>
    )
}