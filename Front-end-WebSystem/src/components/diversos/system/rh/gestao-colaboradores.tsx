import ListColaboradoresAtivos from "@/components/diversos/essential/ListColaboradoresAtivos";
import { Table } from "@/components/ui/table";
import { LabelInputPadrao } from "@/components/diversos/essential/label-input-padrao";
import { cn, formatarDataComum } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MainContext } from "@/provider/main-provider";
import {
  colaboradorSelectGlobal,
  colaboradorSelectGlobalProps,
  stateAlertDialogGlobal,
  stateAlertDialogGlobalProps,
  stateAlertDialogPromoverGlobalProps,
  stateLoundingGlobal,
  stateLoundingGlobalProps,
  stateModalPromoverGlobal,
  stateModalProps,
} from "@/lib/globalStates";
import { useQuery, useMutation } from "react-query";
import {
  AlergiaColaboradorModel,
  ContaBancariaColaboradorModel,
  ContatoColaboradorModel,
  EmpresaColaboradorModel,
  InfoColaboradorCompletoDTO,
} from "@/lib/models";
import axios from "axios";
import { FileText, Plus, Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { state } from "sucrase/dist/types/parser/traverser/base";
import ContainerSystem from "@/components/container/container-system";

export default function GestaoColaboradores() {
  return (
    <>
      <ListColaboradoresAtivos tipoSelect />
      <InformacoesColaboradores />
    </>
  );
}

function InformacoesColaboradores() {
  const colaboradorSelect =
    colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
      (state: any) => state,
    );
  const stateAlertPromover =
    stateModalPromoverGlobal<stateAlertDialogPromoverGlobalProps>(
      (state) => state,
    );
  const { host, acessos, configToken } = useContext(MainContext);
  const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
    (state: any) => state,
  );
  const { data: empresas } = useQuery({
    queryKey: ["empresas"],
    queryFn: async () => {
      const response: EmpresaColaboradorModel[] = await axios
        .get(`${host}/colaborador/find/empresas`, configToken)
        .then((reponse) => reponse.data);
      return response;
    },
    enabled: !!host && !!configToken,
  });
  const { data: setores } = useQuery({
    queryKey: ["setores"],
    queryFn: async () => {
      const response: EmpresaColaboradorModel[] = await axios
        .get(`${host}/colaborador/find/setores`, configToken)
        .then((reponse) => reponse.data);
      return response;
    },
    enabled: !!host && !!configToken,
  });
  const { data: colaborador, refetch } = useQuery({
    queryKey: "infoColaFull",
    queryFn: async () => {
      return await axios
        .get(
          `${host}/colaborador/find/completo?id=${colaboradorSelect.colaborador?.fkAuth}`,
          configToken,
        )
        .then(async (response) => {
          const colaborador: InfoColaboradorCompletoDTO = response.data;
          reset(colaborador);
          setContatos(colaborador.contatos);
          setContasBancarias(colaborador.contasBancarias);
          setFotoColaborador(colaborador.infoPessoais.dirFoto);
          setAlergias(colaborador.alergias);
          return colaborador;
        });
    },
    enabled: !!colaboradorSelect.colaborador?.fkAuth && !!configToken,
  });
  const {
    register,
    formState,
    handleSubmit,
    setValue,
    reset,
    setFocus,
    getValues,
  } = useForm({});
  const [contatos, setContatos] = useState<ContatoColaboradorModel[]>();
  const [alergias, setAlergias] = useState<AlergiaColaboradorModel[]>();
  const [contasBancarias, setContasBancarias] =
    useState<ContaBancariaColaboradorModel[]>();
  const [fotoColaborador, setFotoColaborador] = useState<string>();
  const [dataDeLancamento, setDataDeLancamento] = useState();

  const { mutateAsync: desligarColaborador } = useMutation({
    mutationFn: async () => {
      displayLounding.setDisplayLounding();
      await axios
        .get(
          `${host}/colaborador/update/desligar?id=${colaborador?.infoPessoais.fkAuth}&data=${dataDeLancamento}`,
          configToken,
        )
        .then(async (response) => {
          displayLounding.setDisplaySuccess(response.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
          refetch();
        })
        .catch(async (err) => {
          displayLounding.setDisplayFailure(err.response?.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
        });
    },
  });

  const { mutateAsync: promoverColaborador } = useMutation({
    mutationFn: async () => {
      displayLounding.setDisplayLounding();
      await axios
        .get(
          `${host}/colaborador/update/promover?id=${colaborador?.infoPessoais.fkAuth}&data=${dataDeLancamento}`,
          configToken,
        )
        .then(async (response) => {
          displayLounding.setDisplaySuccess(response.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
          refetch();
        })
        .catch(async (err) => {
          displayLounding.setDisplayFailure(err.response?.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
        });
    },
  });

  const { mutateAsync: reativarColaborador } = useMutation({
    mutationFn: async () => {
      displayLounding.setDisplayLounding();
      await axios
        .get(
          `${host}/colaborador/update/reativar?id=${colaborador?.infoPessoais.fkAuth}&data=${dataDeLancamento}`,
          configToken,
        )
        .then(async (response) => {
          displayLounding.setDisplaySuccess(response.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
          refetch();
        })
        .catch(async (err) => {
          displayLounding.setDisplayFailure(err.response?.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
        });
    },
  });

  const atualizarCadastro = useCallback(
    async (data: any) => {
      displayLounding.setDisplayLounding();
      const infomacoesColaborador: InfoColaboradorCompletoDTO = {
        ...data,
        authColaborador: null,
        contasBancarias: contasBancarias,
        contatos: contatos,
        alergias: alergias,
        infoPessoais: {
          ...data.infoPessoais,
          dirFoto: fotoColaborador,
        },
      };
      await axios
        .put(
          `${host}/colaborador/update/dados`,
          infomacoesColaborador,
          configToken,
        )
        .then(async (response) => {
          displayLounding.setDisplaySuccess(response.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
          refetch();
        })
        .catch(async (err) => {
          displayLounding.setDisplayFailure(err.response?.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
        });
    },
    [
      alergias,
      configToken,
      contasBancarias,
      contatos,
      displayLounding,
      fotoColaborador,
      host,
      refetch,
    ],
  );

  const updateFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    formData.append("file", e.target.files![0]);
    formData.append("dir", "C:/GrupoQualityWeb/outv2/assets/fotoColaborador");

    try {
      const response = await axios
        .post(`${host}/colaborador/update/foto`, formData, configToken)
        .then((response) => response);
      setFotoColaborador(`./assets/fotoColaborador/${response.data}`);
    } catch (error) {
      throw new Error("Falha ao enviar o arquivo");
    }
  };

  useEffect(() => {
    if (colaboradorSelect.colaborador?.fkAuth) {
      refetch();
      if (colaboradorSelect.colaborador?.cep) {
        axios
          .get(
            `https://viacep.com.br/ws/${colaboradorSelect.colaborador.cep}/json/`,
          )
          .then((response) => {
            setValue("bairro", response.data.bairro);
            setValue("localidade", response.data.localidade);
            setValue("logradouro", response.data.logradouro);
            setValue("uf", response.data.uf);
          });
      } else {
        setValue("bairro", "");
        setValue("localidade", "");
        setValue("logradouro", "");
        setValue("uf", "");
      }
    }
  }, [colaboradorSelect.colaborador?.fkAuth]);

  const buscarDatadeDesligamento = () => {
    let data = "";
    switch (colaborador?.infoPessoais.tipo) {
      case "CLT":
        data = colaborador.infoCLT.dataDemissao;
        break;
      case "ESTAGIARIO":
        data = colaborador.infoEstagiario.dataDemissao;
        break;
      case "TERCEIRIZADO":
        data = colaborador.infoMEI.dataDemissao;
        break;
    }

    return data;
  };

  const alterContato = (e: ChangeEvent<any>, i: number) => {
    const { name, value } = e.target;

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
              break
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
    const { name, value } = e.target;

    setContasBancarias((prevState) => {
      return prevState?.map((item, index) => {
        if (index === i) {
          switch (name) {
            case "numeroConta":
              item.numeroConta = value;
              break;
            case "numeroAgencia":
              item.numeroAgencia = value;
              break;
            case "nomeBanco":
              item.nomeBanco = value;
          }
        }
        return item;
      });
    });
  };

  const alterAlergia = (e: ChangeEvent<any>, i: number) => {
    const { name, value } = e.target;

    setAlergias((prevState) => {
      return prevState?.map((item, index) => {
        if (index === i) {
          item.nome = value;
        }
        return item;
      });
    });
  };

  return (
    <>
      <AlertDialog
        open={stateAlertPromover.state}
        onOpenChange={stateAlertPromover.setState}
      >
        <AlertDialogContent className="bg-[var(--color-tec)]">
          <AlertDialogHeader>
            <AlertDialogTitle>{stateAlertPromover.titulo}</AlertDialogTitle>
            <AlertDialogDescription>
              {stateAlertPromover.mensagem}
            </AlertDialogDescription>
            <div>
              <LabelInputPadrao.Root
                name={"data"}
                title={"Data"}
                width={100}
                type="date"
                change={(e) => {
                  setDataDeLancamento(e.target.value);
                }}
                value={dataDeLancamento}
                required
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={stateAlertPromover.action}>
              Executar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ContainerSystem>
        <div className="w-full overflow-auto scrowInvivel border border-slate-600">
          <div className="flex gap-6 flex-col w-full relative ">
            {colaboradorSelect.colaborador && (
              <form
                onSubmit={handleSubmit(atualizarCadastro)}
                className="w-full h-full "
              >
                <div className=" w-full h-full flex flex-col items-center ">
                  <div className="w-full p-5 flex flex-col gap-3   bg-[var(--color-tec)] border-b border-slate-600">
                    <span>
                      Matricula: {colaborador?.infoPessoais.identificacao}
                    </span>
                    <span className="text-xs">Informações pessoais</span>
                    {!colaborador?.authColaborador.status && (
                      <span className="text-sm">{`Este colaborador foi desligado no dia: ${formatarDataComum(
                        buscarDatadeDesligamento(),
                      )}`}</span>
                    )}
                    <div className="flex gap-3 w-full justify-center">
                      <div className="w-[35%] h-full flex items-center justify-center">
                        {!fotoColaborador && (
                          <Button
                            type="button"
                            variant="outline"
                            className=" rounded-full h-[100px] w-[100px] flex items-center justify-center flex-none "
                          >
                            <Plus className="w-3 absolute z-[10]" />
                            <Input
                              type="file"
                              onChange={updateFile}
                              className="text-white z-[20] cursor-pointer bg-transparent file:hidden w-full h-full border border-none"
                            />
                          </Button>
                        )}
                        {fotoColaborador && (
                          <Button
                            type="button"
                            variant="outline"
                            className=" rounded-full h-[100px] w-[100px] flex items-center justify-center flex-none relative"
                          >
                            <Input
                              type="file"
                              onChange={updateFile}
                              className="text-white z-[40] cursor-pointer bg-transparent file:hidden w-full h-full border border-none"
                            />

                            <img
                              src={fotoColaborador}
                              alt="Foto importada"
                              className={
                                "h-[100px] w-[100px] rounded-full z-[10] absolute"
                              }
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 w-full justify-center">
                      <LabelInputPadrao.Root
                        name={"infoPessoais.nomeCompleto"}
                        title={"Nome completo"}
                        width={100}
                        register={register}
                        classNames="w-full"
                        required
                      />
                    </div>
                    <div className="flex gap-3 w-full justify-center">
                      <LabelInputPadrao.Root
                        name={"infoPessoais.cpf"}
                        title={"CPF"}
                        width={40}
                        register={register}
                        classNames="w-full"
                      />
                      <LabelInputPadrao.Root
                        name={"infoPessoais.rg"}
                        title={"RG"}
                        width={40}
                        register={register}
                        classNames="w-full"
                        type="text"
                      />
                      <LabelInputPadrao.Root
                        name={"infoPessoais.pis"}
                        title={"PIS"}
                        width={33}
                        register={register}
                        classNames="w-full"
                        type="text"
                      />
                    </div>
                    <div className="flex gap-3 w-full justify-center">
                      <LabelInputPadrao.Root
                        name={"infoPessoais.nuCarteira"}
                        title={"Nº da cart. de trabalho"}
                        width={50}
                        register={register}
                        classNames="w-full"
                        type="text"
                      />
                      <LabelInputPadrao.Root
                        name={"infoPessoais.dataNascimento"}
                        title={"Data de nascimento"}
                        width={50}
                        register={register}
                        classNames="w-full"
                        type="date"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full p-5 flex flex-col gap-3 relative  bg-[var(--color-tec)] border-b border-slate-600">
                    <span className="text-xs">Endereço</span>
                    <Button
                      onClick={() => {
                        axios
                          .get(
                            `https://viacep.com.br/ws/${
                              getValues().infoPessoais.cep
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
                      type="button"
                      className="absolute top-2 right-2 w-[35px] h-[35px]"
                      variant="default"
                    >
                      <Search className="w-[15px] h-[15px] absolute" />
                    </Button>
                    <div className="flex gap-3 w-full justify-center">
                      <LabelInputPadrao.Root
                        name={"logradouro"}
                        title={"Endereço"}
                        width={100}
                        register={register}
                        classNames="w-full"
                        type="text"
                      />
                    </div>
                    <div className="flex gap-3 w-full justify-center">
                      <LabelInputPadrao.Root
                        name={"infoPessoais.cep"}
                        title={"CEP"}
                        width={50}
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
                      />
                      <LabelInputPadrao.Root
                        name={"uf"}
                        title={"UF"}
                        width={50}
                        register={register}
                        classNames="w-full"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="w-full p-5 flex flex-col gap-3   bg-[var(--color-tec)] border-b border-slate-600">
                    <span className="text-xs">Informações de contrato</span>
                    <div className="flex gap-3 w-full justify-center">
                      <div className={cn("flex flex-col gap-3 w-[50%]")}>
                        <Label htmlFor="tipo">Tipo de contrato</Label>
                        <select
                          className="flex h-9 w-full text-xs border !border-stone-800 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...register("infoPessoais.tipo")}
                          required
                        >
                          <option value="">Escolha</option>
                          <option value="CLT">CLT</option>
                          <option value="ESTAGIARIO">Estagiário</option>
                          <option value="TERCEIRIZADO">Terceirizado</option>
                          <option value="DESLIGADO">Desligado</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full justify-center">
                      <LabelInputPadrao.Root
                        register={register}
                        width={50}
                        title="Email corporativo"
                        name="infoPessoais.emailCorporativo"
                      />
                    </div>
                  </div>
                  {colaborador?.infoPessoais?.tipo === "CLT" ||
                  colaborador?.infoPessoais?.tipo === "ESTAGIARIO" ? (
                    <>
                      <>
                        {(colaborador.infoEstagiario?.status === false ||
                          !colaborador.infoEstagiario) && (
                          <div className="w-full p-5 flex flex-col gap-3   bg-[var(--color-tec)] border-b border-slate-600">
                            <span className="text-xs">Informações CLT</span>
                            <div className="flex gap-3 w-full justify-center">
                              <LabelInputPadrao.Root
                                name={"infoCLT.dataAdmissao"}
                                title={"Data de inicio"}
                                width={50}
                                register={register}
                                classNames="w-full"
                                type="date"
                              />
                              {colaborador?.infoCLT?.dataDemissao && (
                                <LabelInputPadrao.Root
                                  name={"infoCLT.dataDemissao"}
                                  title={"Data de desligamento"}
                                  width={50}
                                  register={register}
                                  classNames="w-full"
                                  type="date"
                                />
                              )}
                            </div>
                            <div className="flex gap-3 w-full justify-center">
                              <div
                                className={cn("flex flex-col gap-3 w-[50%]")}
                              >
                                <Label htmlFor="empresa">Empresa</Label>
                                <select
                                  className="flex h-9 w-full text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  {...register("infoCLT.empresa.id")}
                                  required
                                >
                                  <option value="">Escolha</option>
                                  {empresas?.map((empresa) => {
                                    return (
                                      <option
                                        key={empresa.id}
                                        value={empresa.id}
                                      >
                                        {empresa.nome}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div
                                className={cn("flex flex-col gap-3 w-[50%]")}
                              >
                                <Label htmlFor="setor">Setor</Label>
                                <select
                                  className="flex h-9 w-full text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  {...register("infoCLT.setor.id")}
                                  required
                                >
                                  <option value="">Escolha</option>
                                  {setores?.map((setor) => {
                                    return (
                                      <option key={setor.id} value={setor.id}>
                                        {setor.nome}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </>

                      <>
                        {colaborador.infoEstagiario && (
                          <div className="w-full p-5 flex flex-col gap-3   bg-[var(--color-tec)] border-b border-slate-600">
                            <span className="text-xs">
                              Informações Estágiario
                            </span>
                            <div className="flex gap-3 w-full justify-center">
                              <LabelInputPadrao.Root
                                name={"infoEstagiario.dataAdmissao"}
                                title={"Data de inicio"}
                                width={50}
                                register={register}
                                classNames="w-full"
                                type="date"
                              />
                              {colaborador?.infoEstagiario?.dataDemissao && (
                                <LabelInputPadrao.Root
                                  name={"infoEstagiario.dataDemissao"}
                                  title={"Data de desligamento"}
                                  width={50}
                                  register={register}
                                  classNames="w-full"
                                  type="date"
                                />
                              )}
                            </div>
                            <div className="flex gap-3 w-full justify-center">
                              <div
                                className={cn("flex flex-col gap-3 w-[50%]")}
                              >
                                <Label htmlFor="empresa">Empresa</Label>
                                <select
                                  className="flex h-9 w-full text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  {...register("infoEstagiario.empresa.id")}
                                  required
                                >
                                  <option value="">Escolha</option>
                                  {empresas?.map((empresa) => {
                                    return (
                                      <option
                                        key={empresa.id}
                                        value={empresa.id}
                                      >
                                        {empresa.nome}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div
                                className={cn("flex flex-col gap-3 w-[50%]")}
                              >
                                <Label htmlFor="setor">Setor</Label>
                                <select
                                  className="flex h-9 w-full text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  {...register("infoEstagiario.setor.id")}
                                  required
                                >
                                  <option value="">Escolha</option>
                                  {setores?.map((setor) => {
                                    return (
                                      <option key={setor.id} value={setor.id}>
                                        {setor.nome}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    </>
                  ) : (
                    <>
                      <div className="w-full p-5 flex flex-col gap-3   bg-[var(--color-tec)] border-b border-slate-600">
                        <span className="text-xs">
                          Informações Terceirizado
                        </span>
                        <div className="flex gap-3 w-full justify-center">
                          <LabelInputPadrao.Root
                            name={"infoMEI.dataAdmissao"}
                            title={"Data de inicio"}
                            width={50}
                            register={register}
                            classNames="w-full"
                            type="date"
                          />
                          {colaborador?.infoMEI?.dataDemissao && (
                            <LabelInputPadrao.Root
                              name={"infoMEI.dataDemissao"}
                              title={"Data de desligamento"}
                              width={50}
                              register={register}
                              classNames="w-full"
                              type="date"
                            />
                          )}
                        </div>
                        <div className="flex gap-3 w-full justify-center">
                          <div className={cn("flex flex-col gap-3 w-[50%]")}>
                            <Label htmlFor="empresa">Empresa</Label>
                            <select
                              className="flex h-9 w-full text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              {...register("infoMEI.empresa.id")}
                              required
                            >
                              <option value="">Escolha</option>
                              {empresas?.map((empresa) => {
                                return (
                                  <option key={empresa.id} value={empresa.id}>
                                    {empresa.nome}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className={cn("flex flex-col gap-3 w-[50%]")}>
                            <Label htmlFor="setor">Setor</Label>
                            <select
                              className="flex h-9 w-full text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              {...register("infoMEI.setor.id")}
                              required
                            >
                              <option value="">Escolha</option>
                              {setores?.map((setor) => {
                                return (
                                  <option key={setor.id} value={setor.id}>
                                    {setor.nome}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="w-full p-5 flex flex-col gap-3   bg-[var(--color-tec)] border-b border-slate-600">
                    <span className="text-xs">Contatos</span>
                    {contatos?.map((contato, i) => {
                      return (
                        <div
                          key={contato.id}
                          className="w-[100%] p-5 flex flex-col gap-3   bg-[var(--color-tec)]"
                        >
                          <span className="text-xs">{contato.tipo}</span>
                          <div className="flex relative gap-3 w-full justify-center">
                            <div className={cn("flex flex-col gap-3 w-[50%]")}>
                              <Label htmlFor="tipo">Tipo de contato</Label>
                              <select
                                className="flex h-9 w-full text-xs border !border-stone-800 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                              <Trash className="w-[15px] h-[15px] absolute" />
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
                              colaboradorReferent:
                                colaboradorSelect.colaborador!,
                            };
                            return [...prevState!, novaConta];
                          });
                        }}
                        type="button"
                        variant="outline"
                      >
                        <Plus />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  <div className="w-full p-5 flex flex-col gap-3   bg-[var(--color-tec)] border-b border-slate-600">
                    <span className="text-xs">Contas bancarias</span>
                    {contasBancarias?.map((contas, i) => {
                      return (
                        <div
                          key={contas.id}
                          className="w-[100%] p-5 flex flex-col gap-3   bg-[var(--color-tec)]"
                        >
                          <span className="text-xs">Conta: {contas.id}</span>
                          <div className="flex gap-3 w-full justify-center relative">
                            <LabelInputPadrao.Root
                              name={"nomeBanco"}
                              title={"Nome do banco"}
                              width={50}
                              change={(e) => alterConta(e, i)}
                              value={contas.nomeBanco}
                              classNames="w-full"
                              required
                            />
                            <LabelInputPadrao.Root
                              name={"numeroConta"}
                              title={"Nº da conta"}
                              width={50}
                              change={(e) => alterConta(e, i)}
                              value={contas.numeroConta}
                              classNames="w-full"
                              required
                            />
                            <LabelInputPadrao.Root
                              name={"numeroAgencia"}
                              title={"Nº da agencia"}
                              change={(e) => alterConta(e, i)}
                              value={contas.numeroAgencia}
                              width={50}
                              classNames="w-full"
                              required
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                setContasBancarias((prevState) => {
                                  return prevState?.filter(
                                    (contaReferent, index) => i !== index,
                                  );
                                });
                              }}
                              className="absolute -top-8 right-2 w-[35px] h-[35px]"
                              variant="destructive"
                            >
                              <Trash className="w-[15px] h-[15px] absolute" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex gap-3 w-full justify-center">
                      <Button
                        type="button"
                        onClick={() => {
                          setContasBancarias((prevState) => {
                            const novaConta: ContaBancariaColaboradorModel = {
                              colaboradorReferent:
                                colaboradorSelect.colaborador!,
                            };
                            return [...prevState!, novaConta];
                          });
                        }}
                        variant="outline"
                      >
                        <Plus />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                  <div className="w-full p-5 flex flex-col gap-3  bg-[var(--color-tec)] border-b border-slate-600">
                    <span className="text-xs">Alergias</span>
                    {alergias?.map((alergia, i) => {
                      return (
                        <div
                          key={alergia.id}
                          className="w-[100%] p-5 flex flex-col gap-3   bg-[var(--color-tec)]"
                        >
                          <span className="text-xs">Alergia: {alergia.id}</span>
                          <div className="flex gap-3 w-full justify-center relative">
                            <LabelInputPadrao.Root
                              name={"nome"}
                              title={"Descrição"}
                              width={50}
                              change={(e) => alterAlergia(e, i)}
                              value={alergia.nome}
                              classNames="w-full"
                              required
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                setAlergias((prevState) => {
                                  return prevState?.filter(
                                    (alergiaReferent, index) => i !== index,
                                  );
                                });
                              }}
                              className="absolute -top-8 right-2 w-[35px] h-[35px]"
                              variant="destructive"
                            >
                              <Trash className="w-[15px] h-[15px] absolute" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex gap-3 w-full justify-center">
                      <Button
                        type="button"
                        onClick={() => {
                          setAlergias((prevState) => {
                            const novaAlergia: AlergiaColaboradorModel = {
                              colaboradorReferent:
                                colaboradorSelect.colaborador!,
                            };
                            return [...prevState!, novaAlergia];
                          });
                        }}
                        variant="outline"
                      >
                        <Plus />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  <div className="w-full flex gap-3 py-6 justify-center items-center bg-[var(--color-tec)]">
                    <Button type="submit">Atualizar</Button>
                    {colaborador?.infoPessoais.tipo === "ESTAGIARIO" && (
                      <Button
                        type="button"
                        onClick={() =>
                          stateAlertPromover.setAlert(
                            "Promover estagiario",
                            "Atenção está ação é definitiva!",
                            promoverColaborador,
                          )
                        }
                      >
                        Promover
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={async () => {
                        displayLounding.setDisplayLounding();
                        displayLounding.setDisplaySuccess("Dados restaurados");
                        refetch();
                        await new Promise((resolve) =>
                          setTimeout(resolve, 2000),
                        );
                        displayLounding.setDisplayReset();
                      }}
                    >
                      Restaurar dados
                    </Button>
                    {colaborador?.authColaborador.status ? (
                      <Button
                        onClick={() =>
                          stateAlertPromover.setAlert(
                            "Desligar colaborador",
                            "Atenção está ação é definitiva!",
                            desligarColaborador,
                          )
                        }
                        type="button"
                      >
                        Desligar
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          stateAlertPromover.setAlert(
                            "Recontratar colaborador",
                            "Ao recontratar ele irá voltar para o mesmo tipo de contrato de quando ele foi desligado",
                            reativarColaborador,
                          )
                        }
                        type="button"
                      >
                        Re-contratar
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </ContainerSystem>
    </>
  );
}
