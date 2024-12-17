import {
  colaboradorSelectGlobal,
  colaboradorSelectGlobalProps,
  dadosRelatorioHorasTodosGlobal,
  dadosRelatorioHorasTodosProps,
  dadosRelatorioSegundaViaGlobal,
  dadosRelatorioSegundaViaProps,
  solicitacaoSelectGlobal,
  solicitacaoSelectGlobalProps,
  stateAlertDialogGlobal,
  stateAlertDialogGlobalProps,
  stateItensSolicitacaoEstoqueGlobal,
  stateLoundingGlobal,
  stateLoundingGlobalProps,
  stateModalAnotacaoRelatorioGlobal,
  stateModalDeletarTicketGlobal,
  stateModalFinalizarSolicitacaoEstoqueGlobal,
  stateModalHistoricoTicketGlobal,
  stateModalNotifyGlobal,
  stateModalProps,
  stateModalSelecionarItemEstoqueGlobal,
  stateModalSolicitarTicketGlobal,
  stateModalTrocaRamalGlobal,
  stateNotifyDateGlobal,
  stateNotifyDateProps,
} from "@/lib/globalStates";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  InfoColaboradorCompletoDTO,
  ItemSolicitadoEstoqueModel,
  ResponseFindAnotacaoRhDTO,
  SolicitacaoItensEstoqueDTO,
  SolicitcaoTiModels,
} from "@/lib/models";
import {
  cn,
  data1MesAtrasInput,
  dataAtualInput,
  formatarDataComum,
  visualizarNotify,
} from "@/lib/utils";
import { MainContext } from "@/provider/main-provider";
import axios from "axios";

import { useForm } from "react-hook-form";
import { LabelInputPadrao } from "../diversos/essential/label-input-padrao";
import ListAnexos from "../diversos/essential/list-anexos";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { useQuery, useMutation } from "react-query";
import ContainerSystem from "../container/container-system";
import ListColaboradoresAtivos from "../diversos/essential/ListColaboradoresAtivos";
import Router from "next/router";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Package,
  MessageCircleQuestion,
  Trash,
  Minus,
  Plus,
} from "lucide-react";
import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog";
import { ListaSolicitacoes } from "@/components/diversos/system/suporte/suporte-find-solicitacoes";

export function Modals() {
  return (
    <>
      <ModalFindSolicitacao />
      <DrawerAbrirSolicitacao />
      <ModalGerarRelatorioRh />
      <ModalNotifys />
      <ModalFinalizarSolicitacao />
      <ModalDeletarTicket />
    </>
  );
}

function ModalFindSolicitacao() {
  const state = stateModalHistoricoTicketGlobal<stateModalProps>(
    (state) => state,
  );

  return (
    <>
      <Dialog open={state.stateModal} onOpenChange={state.alterState}>
        <DialogContent className="!max-w-[68rem] min-h-[90%] bg-[var(--color-tec)]">
          <DialogHeader>
            <DialogTitle>Historico solicitações</DialogTitle>
            <DialogDescription>
              Aqui você irá conseguir buscar todas as solicitações e verificar o
              que aconteceu com cada uma delas.
            </DialogDescription>
            <div className="border rounded-xl p-5 w-full h-full">
              <ListaSolicitacoes />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DrawerAbrirSolicitacao() {
  const { register, handleSubmit, reset } = useForm();
  const { user, host, configToken } = useContext(MainContext);
  const displayLounding = stateLoundingGlobal((state: any) => state);
  const [anexoListItens, setAnexoListItens] = useState<File[]>([]);

  //--------------TI------------//
  const state = stateModalSolicitarTicketGlobal<stateModalProps>(
    (state) => state,
  );

  const updateFiles = async (): Promise<string[]> => {
    const updatedAnexos: string[] = [];
    for (let i = 0; i < anexoListItens.length; i++) {
      const formData = new FormData();
      formData.append("file", anexoListItens[i]);
      formData.append("dir", "C:/GrupoQualityWeb/outv2/assets/arquivosTicket");

      try {
        const response = await axios.post(
          `${host}/suporte/create/update/files`,
          formData,
          configToken,
        );
        updatedAnexos.push(`arquivosTicket/${response.data}`);
      } catch (error) {
        throw new Error("Falha ao enviar o arquivo");
      }
    }
    return updatedAnexos;
  };

  const sendSolicitacao = async (
    data: { titulo: string; ocorrencia: string } | any,
  ) => {
    displayLounding.setDisplayLounding();
    let updatedAnexos: string[] = [];
    if (anexoListItens.length !== 0) {
      try {
        updatedAnexos = await updateFiles();
      } catch {
        displayLounding.setDisplayFailure(
          "Falha na tentativa de enviar os documentos. Tente novamente!",
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        displayLounding.setDisplayReset();
        return;
      }
    }

    const { titulo, ocorrencia } = data;
    const solicitacao: SolicitcaoTiModels = {
      titulo: titulo,
      ocorrencia: ocorrencia,
      solicitante: user?.fkAuth,
      anexos: updatedAnexos.length === 0 ? null : JSON.stringify(updatedAnexos),
    };
    await axios
      .post(`${host}/suporte/create/solicitacao`, solicitacao, configToken)
      .then(async (response) => {
        displayLounding.setDisplaySuccess(response.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        displayLounding.setDisplayReset();
        state.setStateModal(false);
        setAnexoListItens([]);
        reset();
      })
      .catch(async (err) => {
        displayLounding.setDisplayFailure(
          "Falha em abrir uma solicitação. Tente novamente!",
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        displayLounding.setDisplayReset();
      });
  };

  return (
    <>
      <Dialog open={state.stateModal} onOpenChange={state.alterState}>
        <DialogContent className="z-[60] bg-[var(--color-tec)]">
          <DialogHeader>
            <DialogTitle>Solicitar ticket</DialogTitle>
          </DialogHeader>
          <form
            method="POST"
            onSubmit={handleSubmit(sendSolicitacao)}
            className="flex flex-col gap-5"
          >
            <LabelInputPadrao.Root
              type="text"
              title="Titulo da solicitação"
              name="titulo"
              register={register}
              width={100}
              required={true}
            />
            <LabelInputPadrao.Root
              title="Ocorrencia"
              name="ocorrencia"
              register={register}
              width={100}
              textArea
              required={true}
            />
            <div className={cn("flex flex-col gap-4")}>
              <Label>Anexos</Label>
              <ListAnexos list={anexoListItens} alterList={setAnexoListItens} />
            </div>
            <Button type="submit">Enviar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

type filtroProps = {
  anotacao: string;
  tipo: string;
  status: boolean;
  dataInicio: string;
  motivo: string;
  dataFim: string;
  idColaborador: string;
};

function ModalGerarRelatorioRh() {
  const state = stateModalAnotacaoRelatorioGlobal<stateModalProps>(
    (state) => state,
  );
  const dadosSegundaVia =
    dadosRelatorioSegundaViaGlobal<dadosRelatorioSegundaViaProps>(
      (state) => state,
    );
  const dadosTodos =
    dadosRelatorioHorasTodosGlobal<dadosRelatorioHorasTodosProps>(
      (state) => state,
    );
  const { host, configToken } = useContext(MainContext);
  const { colaborador } = colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
    (state: any) => state,
  );
  const { data: colaboradorRequest, refetch } = useQuery({
    queryKey: "infoFullColaborador",
    queryFn: async () => {
      return await axios
        .get(
          `${host}/colaborador/find/completo?id=${colaborador?.fkAuth}`,
          configToken,
        )
        .then(async (response) => {
          const colaborador: InfoColaboradorCompletoDTO = response.data;
          return colaborador;
        });
    },
    enabled: !!colaborador?.fkAuth && !!configToken,
  });
  const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
    (state: any) => state,
  );

  const [filtro, setFiltro] = useState<filtroProps>({
    anotacao: "",
    tipo: "",
    status: true,
    motivo: "",
    dataInicio: data1MesAtrasInput(),
    dataFim: dataAtualInput(),
    idColaborador: "",
  });
  const stateAlert = stateAlertDialogGlobal<stateAlertDialogGlobalProps>(
    (state) => state,
  );

  const alterFiltro = (e: ChangeEvent<any>) => {
    const { name, value } = e.target;
    if (name === "status") {
      setFiltro((prevState: any) => ({
        ...prevState,
        status: value === "true",
      }));
      return;
    }
    if (name === "dataInicio") {
      dadosSegundaVia.setDataInicial(value);
    }
    if (name === "dataFinal") {
      dadosSegundaVia.setDataFinal(value);
    }
    setFiltro((prevState: any) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (!colaborador) {
      return;
    }
    setFiltro((prevState) => ({
      ...prevState,
      tipo: colaborador?.tipo,
      idColaborador: colaborador.fkAuth.toString()!,
    }));
    refetch();
  }, [colaborador]);

  const { mutateAsync: relatorioSegundaVia } = useMutation({
    mutationFn: async () => {
      displayLounding.setDisplayLounding();
      dadosSegundaVia.setDataInicial(filtro.dataInicio);
      dadosSegundaVia.setDataFinal(filtro.dataFim);
      await axios
        .get(
          `${host}/rh/find/anotacao/filter/relatorio/segvia?anotacao=${filtro.anotacao}&id=${colaborador?.fkAuth}&motivo=${filtro.motivo}&tipo=${filtro.tipo}&status=${filtro.status}&dataInicio=${filtro.dataInicio}&dataFim=${filtro.dataFim}`,
          configToken,
        )
        .then((response) => {
          displayLounding.setDisplaySuccess("Consulta feita com sucesso!");
          const anotacoes: ResponseFindAnotacaoRhDTO = response.data;
          dadosSegundaVia.setDados(anotacoes);
          state.alterState();
          Router.push("/rh/relatorio/horas/unique");
          displayLounding.setDisplayReset();
        })
        .catch(async () => {
          displayLounding.setDisplayFailure(
            "Não foi possivel fazer a consulta no momento",
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
          if (!colaborador?.fkAuth) {
            stateAlert.setAlert(
              "Atenção",
              "Para gerar um relatorio geral ou segunda via, precisa selecionar um colaborador",
              () => {},
            );
          }
        });
    },
  });

  const { mutateAsync: relatoriosTodos } = useMutation({
    mutationFn: async () => {
      dadosTodos.setDataInicial(filtro.dataInicio);
      dadosTodos.setDataFinal(filtro.dataFim);
      await axios
        .get(
          `${host}/rh/find/anotacao/filter/relatorio/all?anotacao=${filtro.anotacao}&tipo=CLT&status=${filtro.status}&motivo=${filtro.motivo}&dataInicio=${filtro.dataInicio}&dataFim=${filtro.dataFim}`,
          configToken,
        )
        .then((response) => {
          displayLounding.setDisplaySuccess("Consulta feita com sucesso!");
          const anotacoes: ResponseFindAnotacaoRhDTO[] = response.data;
          dadosTodos.setDados(anotacoes);
          state.alterState();
          Router.push("/rh/relatorio/horas/all");
          displayLounding.setDisplayReset();
        })
        .catch(async () => {
          displayLounding.setDisplayFailure(
            "Não foi possivel fazer a consulta no momento",
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
        });
    },
  });
  const { mutateAsync: relatorioGeral } = useMutation({
    mutationFn: async () => {
      dadosSegundaVia.setDataInicial(filtro.dataInicio);
      dadosSegundaVia.setDataFinal(filtro.dataFim);
      await axios
        .get(
          `${host}/rh/find/anotacao/filter/relatorio/segvia?anotacao=${filtro.anotacao}&id=${colaborador?.fkAuth}&tipo=${filtro.tipo}&status=${filtro.status}&motivo=${filtro.motivo}&dataInicio=${filtro.dataInicio}&dataFim=${filtro.dataFim}`,
          configToken,
        )
        .then((response) => {
          displayLounding.setDisplaySuccess("Consulta feita com sucesso!");
          const anotacoes: ResponseFindAnotacaoRhDTO = response.data;
          dadosSegundaVia.setDados(anotacoes);
          state.alterState();
          Router.push("/rh/relatorio/geral");
          displayLounding.setDisplayReset();
        })
        .catch(async () => {
          displayLounding.setDisplayFailure(
            "Não foi possivel fazer a consulta no momento",
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
          if (!colaborador?.fkAuth) {
            stateAlert.setAlert(
              "Atenção",
              "Para gerar um relatorio geral ou segunda via, precisa selecionar um colaborador",
              () => {},
            );
          }
        });
    },
  });

  return (
    <>
      <Dialog open={state.stateModal} onOpenChange={state.alterState}>
        <DialogContent className="!max-w-[68rem] min-h-[90%] bg-[var(--color-tec)]">
          <DialogHeader>
            <DialogTitle>Gerar relatório</DialogTitle>
            <DialogDescription>
              Você irá conseguir puxar dados com base no historico do
              colaborador!
            </DialogDescription>
            <main className="w-full h-full flex items-center justify-center ">
              <ListColaboradoresAtivos tipoSelect />
              <ContainerSystem inputsClass="p-5 ">
                <div className="flex w-[80%] ">
                  <div>
                    <img
                      height={100}
                      width={100}
                      src={colaboradorRequest?.infoPessoais.dirFoto!!}
                      className={"w-[100px] h-[100px]"}
                      alt="Foto do Colaborador"
                    />
                  </div>
                  <div className=" h-full flex flex-col text-xs px-3">
                    {colaboradorRequest?.infoPessoais.fkAuth && (
                      <span>
                        Código de registro:{" "}
                        {colaboradorRequest?.infoPessoais.fkAuth}
                      </span>
                    )}
                    <span>
                      Nome: {colaboradorRequest?.infoPessoais.nomeCompleto}
                    </span>
                    {colaboradorRequest?.infoPessoais.dataNascimento && (
                      <span>
                        Idade:{" "}
                        {new Date().getFullYear() -
                          parseInt(
                            colaboradorRequest?.infoPessoais.dataNascimento.split(
                              "-",
                            )[0],
                          )}{" "}
                        anos (
                        {
                          formatarDataComum(
                            colaboradorRequest?.infoPessoais.dataNascimento,
                          )?.split(" ")[0]
                        }
                        )
                      </span>
                    )}

                    {colaboradorRequest?.infoPessoais.cpf && (
                      <span>CPF: {colaboradorRequest?.infoPessoais.cpf}</span>
                    )}
                  </div>
                  <div className="h-full flex flex-col text-xs px-3">
                    {colaboradorRequest?.infoMEI ? (
                      <>
                        {colaboradorRequest?.infoMEI?.dataAdmissao && (
                          <span>
                            Data de contratação:{" "}
                            {formatarDataComum(
                              colaboradorRequest?.infoMEI.dataAdmissao,
                            )}
                          </span>
                        )}
                        {colaboradorRequest?.infoMEI?.dataDemissao && (
                          <span>
                            Data de desligamento:{" "}
                            {formatarDataComum(
                              colaboradorRequest?.infoMEI.dataDemissao,
                            )}
                          </span>
                        )}
                        {colaboradorRequest?.infoMEI.empresa?.nome && (
                          <span>
                            Empresa: {colaboradorRequest?.infoMEI.empresa.nome}
                          </span>
                        )}
                        {colaboradorRequest?.infoMEI.setor?.nome && (
                          <span>
                            Setor: {colaboradorRequest?.infoMEI.setor.nome}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        {colaboradorRequest?.infoCLT &&
                        !colaboradorRequest?.infoEstagiario?.status ? (
                          <>
                            {colaboradorRequest?.infoCLT?.dataAdmissao && (
                              <span>
                                Data de contratação:{" "}
                                {formatarDataComum(
                                  colaboradorRequest?.infoCLT.dataAdmissao,
                                )}
                              </span>
                            )}
                            {colaboradorRequest?.infoCLT?.dataDemissao && (
                              <span>
                                Data de desligamento:{" "}
                                {formatarDataComum(
                                  colaboradorRequest?.infoCLT.dataDemissao,
                                )}
                              </span>
                            )}
                            {colaboradorRequest?.infoCLT.empresa?.nome && (
                              <span>
                                Empresa:{" "}
                                {colaboradorRequest?.infoCLT.empresa.nome}
                              </span>
                            )}
                            {colaboradorRequest?.infoCLT.setor?.nome && (
                              <span>
                                Setor: {colaboradorRequest?.infoCLT.setor.nome}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {colaboradorRequest?.infoEstagiario
                              ?.dataAdmissao && (
                              <span>
                                Data de contratação:{" "}
                                {
                                  colaboradorRequest?.infoEstagiario
                                    .dataAdmissao
                                }
                              </span>
                            )}
                            {colaboradorRequest?.infoEstagiario
                              ?.dataDemissao && (
                              <span>
                                Data de desligamento:{" "}
                                {
                                  colaboradorRequest?.infoEstagiario
                                    .dataDemissao
                                }
                              </span>
                            )}
                            {colaboradorRequest?.infoEstagiario?.empresa
                              ?.nome && (
                              <span>
                                Empresa:{" "}
                                {
                                  colaboradorRequest?.infoEstagiario.empresa
                                    .nome
                                }
                              </span>
                            )}
                            {colaboradorRequest?.infoEstagiario?.setor
                              ?.nome && (
                              <span>
                                Setor:{" "}
                                {colaboradorRequest?.infoEstagiario.setor.nome}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full h-full flex flex-col justify-center px-40 gap-5">
                  <LabelInputPadrao.Root
                    name={"dataInicio"}
                    title={"Data de inicio"}
                    width={100}
                    type={"date"}
                    change={alterFiltro}
                    value={filtro.dataInicio}
                  />
                  <LabelInputPadrao.Root
                    name={"dataFim"}
                    title={"Data final"}
                    width={100}
                    type={"date"}
                    change={alterFiltro}
                    value={filtro.dataFim}
                  />
                  <Button type="button" onClick={() => relatoriosTodos()}>
                    Relatório - Todos - CLT (Banco de horas)
                  </Button>
                  <Button type="button" onClick={() => relatorioSegundaVia()}>
                    Relatório - Segunda-via - Individual (Banco de horas)
                  </Button>
                  <Button type="button" onClick={() => relatorioGeral()}>
                    Relátorio geral
                  </Button>
                </div>
              </ContainerSystem>
            </main>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ModalNotifys() {
  const { host, acessos, configToken, user } = useContext(MainContext);
  const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
    (state: any) => state,
  );
  const notifyAmazem = stateNotifyDateGlobal<stateNotifyDateProps>(
    (state: any) => state,
  );
  const { stateModal, alterState, setStateModal } = stateModalNotifyGlobal<any>(
    (state) => state,
  );
  const [quantidade, setQuantidade] = useState({
    sistema: 0,
    rh: 0,
    estoque: 0,
    suporte: 0,
  });
  const [filtro, setFiltro] = useState("sistema");

  useEffect(() => {
    setQuantidade((prevState) => ({
      ...prevState,
      estoque: notifyAmazem.notifys.filter(
        (value) => value.intensao === "estoque",
      ).length,
      suporte: notifyAmazem.notifys.filter(
        (value) => value.intensao === "suporte",
      ).length,
      rh: notifyAmazem.notifys.filter((value) => value.intensao === "rh")
        .length,
      sistema: notifyAmazem.notifys.filter(
        (value) => value.intensao === "sistema",
      ).length,
    }));
  }, [notifyAmazem.tamanhoAntigo]);

  return (
    <>
      <Dialog open={stateModal} onOpenChange={alterState}>
        <DialogContent className="!max-w-[60rem] min-h-[80%] bg-[var(--color-tec)]">
          <DialogHeader>
            <DialogTitle>Painel de notificações</DialogTitle>
            <div className="border rounded-xl p-5 h-full w-full flex gap-5">
              <div className="w-[50%] h-full flex flex-col gap-5 py-2">
                <div className="w-full h-full flex flex-col gap-5 items-start justify-start relative">
                  <Button
                    onClick={() => setFiltro("sistema")}
                    className="w-[80%] h-[50px] flex justify-between"
                  >
                    <span>{quantidade.sistema}</span>
                    <span>Sistema</span>
                  </Button>
                  <Button
                    onClick={() => setFiltro("rh")}
                    className="w-[80%] h-[50px] flex justify-between"
                  >
                    <span>{quantidade.rh}</span>
                    <span>RH</span>
                  </Button>
                  <Button
                    onClick={() => setFiltro("estoque")}
                    className="w-[80%] h-[50px] flex justify-between"
                  >
                    <span>{quantidade.estoque}</span>
                    <span>Estoque</span>
                  </Button>
                  <Button
                    onClick={() => setFiltro("suporte")}
                    className="w-[80%] h-[50px] flex justify-between"
                  >
                    <span>{quantidade.suporte}</span>
                    <span>Suporte</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-[80%] h-[50px] bottom-0 flex justify-center absolute"
                      >
                        <span>Limpar Tudo</span>
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
                        <AlertDialogAction
                          onClick={async () => {
                            await axios.get(
                              `${host}/notify/update/limpar?id=${user?.fkAuth}`,
                              configToken,
                            );
                            notifyAmazem.setTamanho(0);
                            notifyAmazem.setNotifys([]);
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="w-[50%] h-full relative overflow-auto">
                <ul className="w-full h-full absolute flex flex-col gap-5 py-2">
                  {notifyAmazem.notifys
                    .filter((value) => value.intensao === filtro)
                    .sort((a, b) => b.id - a.id)
                    .map((notify) => {
                      return (
                        <li
                          className={
                            "border z-20 border-stone-600 cursor-pointer w-full p-2  rounded-xl flex flex-col gap-2 active:scale-95 transition-all"
                          }
                          key={notify.id}
                        >
                          <div className="flex items-center gap-5 w-full relative">
                            <div
                              onClick={() => {
                                visualizarNotify(
                                  notify,
                                  host,
                                  configToken,
                                  setStateModal,
                                );
                              }}
                              className="bg-blue-950 w-[40px] h-[40px] flex justify-center items-center rounded-md"
                            >
                              {notify.intensao === "estoque" && (
                                <Package className="invert w-[17px] h-[17px]" />
                              )}
                              {notify.intensao === "suporte" && (
                                <MessageCircleQuestion className="invert w-[17px] h-[17px]" />
                              )}
                            </div>
                            <span
                              onClick={() => {
                                visualizarNotify(
                                  notify,
                                  host,
                                  configToken,
                                  setStateModal,
                                );
                              }}
                              className="text-sm font-semibold"
                            >
                              {notify.titulo}{" "}
                            </span>
                            <Button
                              type="button"
                              onClick={async () => {
                                await axios.get(
                                  `${host}/notify/update/desative?id=${notify.id}`,
                                  configToken,
                                );
                                notifyAmazem.setTamanho(
                                  notifyAmazem.tamanhoAntigo - 1,
                                );
                                notifyAmazem.setNotifys(
                                  notifyAmazem.notifys.filter(
                                    (value, index) => value.id !== notify.id,
                                  ),
                                );
                              }}
                              variant="destructive"
                              className="w-[30px] h-[30px] absolute right-3 z-[60]"
                            >
                              <Trash className="w-[17px] h-[17px] absolute" />
                            </Button>
                          </div>
                          <span
                            onClick={() => {
                              visualizarNotify(
                                notify,
                                host,
                                configToken,
                                setStateModal,
                              );
                            }}
                            className="text-sm"
                          >
                            {notify.texto}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ModalFinalizarSolicitacao() {
  const state = stateModalFinalizarSolicitacaoEstoqueGlobal<stateModalProps>(
    (state) => state,
  );
  const [itensSelecionados, setItens] = useState<ItemSolicitadoEstoqueModel[]>(
    [],
  );
  const { host, acessos, configToken, user } = useContext(MainContext);
  const { stateModal: stateModalSelecionarItem } =
    stateModalSelecionarItemEstoqueGlobal<stateModalProps>((state) => state);
  const { register, handleSubmit, getValues, reset, setValue } = useForm();
  const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
    (state: any) => state,
  );
  const itensSolicitados = stateItensSolicitacaoEstoqueGlobal<{
    itens: ItemSolicitadoEstoqueModel[];
    setItens: (item: ItemSolicitadoEstoqueModel) => void;
    insertItens: (item: ItemSolicitadoEstoqueModel[]) => void;
    reset: () => void;
  }>((state) => state);

  useEffect(() => {
    setItens(itensSolicitados.itens);
  }, [stateModalSelecionarItem]);

  useEffect(() => {
    itensSolicitados.insertItens(itensSelecionados);
  }, [itensSelecionados]);

  const removerItem = (indexItem: number) => {
    setItens((prevState) => {
      if (prevState![indexItem].quantidade <= 1) {
        return prevState?.filter((item, i) => i !== indexItem);
      } else {
        return prevState?.map((item, i) => {
          if (i === indexItem) {
            item.quantidade--;
            if (item.quantidade >= item.item.quantidade) {
              item.quantidade = item.item.quantidade!;
            }
          }
          return item;
        });
      }
    });
  };

  const addItem = (indexItem: number) => {
    setItens((prevState) => {
      return prevState?.map((item, i) => {
        if (i === indexItem) {
          item.quantidade++;
          if (item.quantidade >= item.item.quantidade) {
            item.quantidade = item.item.quantidade!;
          }
        }
        return item;
      });
    });
  };

  const enviarSolicitacao = useCallback(
    async (data: any) => {
      displayLounding.setDisplayLounding();
      let createSolicitacao: SolicitacaoItensEstoqueDTO = {
        solicitacao: {
          ...data,
          solicitante: user?.fkAuth,
        },
        itens: itensSelecionados!,
      };

      axios
        .post(
          `${host}/estoque/create/solicitacao`,
          createSolicitacao,
          configToken,
        )
        .then(async (response) => {
          displayLounding.setDisplaySuccess(response.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
          reset();
          setItens([]);
          itensSolicitados.reset();
          state.alterState();
        })
        .catch(async (err) => {
          displayLounding.setDisplayFailure(err.response.data);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          displayLounding.setDisplayReset();
        });
    },
    [user?.fkAuth, itensSelecionados, host, configToken],
  );

  return (
    <>
      <Dialog open={state.stateModal} onOpenChange={state.alterState}>
        <DialogContent className="!max-w-[64rem] min-h-[80%] bg-[var(--color-tec)]">
          <DialogHeader>
            <DialogTitle>Finalizar pedido</DialogTitle>
            <div className="rounded-xl p-5 h-full w-full flex gap-5 border border-slate-600">
              <form
                className="w-[50%] p-5 h-full flex flex-col gap-5 border-r border-slate-600"
                onSubmit={handleSubmit(enviarSolicitacao)}
              >
                <span className="text-xs">
                  A partir das 10H é obrigatorio definir a “Prioridade“, caso a
                  prioridade sejá alta é obrigatorio descrever o “Motivo“!
                </span>
                {new Date().getHours() >= 10 && (
                  <div className="w-[100%] h-full flex flex-col gap-5 relative ">
                    <div className={cn("flex flex-col gap-3 w-full relative")}>
                      <Label className="text-sm">Prioridade</Label>
                      <select
                        {...register("prioridade")}
                        className="flex h-9 w-full rounded-md text-xs border !border-stone-600 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="baixa">Baixa</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>
                    <LabelInputPadrao.Root
                      name={"mensagem"}
                      title={"Motivo"}
                      register={register}
                      textArea
                      width={100}
                    />
                  </div>
                )}
                <div>
                  <Button type="submit" autoFocus={true}>
                    Solicitar
                  </Button>
                </div>
              </form>
              <div className="w-[50%] h-full relative overflow-auto ">
                <ul className="w-full h-full absolute flex flex-col gap-5 py-2">
                  {itensSelecionados?.map((item, i) => {
                    return (
                      <>
                        <li
                          key={i}
                          className="flex w-full h-[80px] items-center gap-5 justify-between p-5"
                        >
                          <div className="max-w-[80px] h-[80px]">
                            <img
                              width={80}
                              height={80}
                              src={item.item?.dirFoto}
                              className="w-[80px] h-[80px] rounded-xl"
                              alt=""
                            />
                          </div>
                          <span className="smallSpan whitespace-nowrap min-w-[105px] max-w-[105px] overflow-hidden">
                            {item.item.nome}
                          </span>
                          <div className="flex items-center gap-5 max-w-[105px]">
                            <Button onClick={() => addItem(i)}>
                              <Plus className="w-3 absolute z-[10]" />
                            </Button>
                            <span className="text-sm font-bold">
                              {item.quantidade}
                            </span>
                            <Button onClick={() => removerItem(i)}>
                              {item.quantidade <= 1 ? (
                                <Trash className="w-3 absolute z-[10]" />
                              ) : (
                                <Minus className="w-3 absolute z-[10]" />
                              )}
                            </Button>
                          </div>
                        </li>
                        <hr className="border-stone-400" />
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ModalDeletarTicket() {
  const state = stateModalDeletarTicketGlobal<stateModalProps>(
    (state) => state,
  );
  const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
    (state: any) => state,
  );
  const selectSolicitacao =
    solicitacaoSelectGlobal<solicitacaoSelectGlobalProps>(
      (state: any) => state,
    );
  const { host, configToken } = useContext(MainContext);

  const deletarSolicitacao = async () => {
    displayLounding.setDisplayLounding();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await axios
      .delete(
        `${host}/suporte/update/solicitacao?id=${selectSolicitacao.solicitacaoSelect?.id}`,
        configToken,
      )
      .then(async () => {
        displayLounding.setDisplaySuccess("Solicitação excluída com sucesso!");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        displayLounding.setDisplayReset();
        state.alterState();
        selectSolicitacao.setSelect(null);
      })
      .catch(async () => {
        displayLounding.setDisplayFailure(
          "Não foi possivel deletar está solicitação no momento!",
        );
        await new Promise((resolve) => setTimeout(resolve, 1500));
        displayLounding.setDisplayReset();
      });
  };

  return (
    <>
      <Dialog open={state.stateModal} onOpenChange={state.alterState}>
        <DialogContent className="bg-[var(--color-tec)]">
          <DialogHeader>
            <DialogTitle>Quer realmente deletar está solicitação?</DialogTitle>
            <DialogDescription>
              Ao deletar a solicitação, todos os dados da mesma será excluido do
              nosso servidor!
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-3">
            <Button
              onClick={deletarSolicitacao}
              type="button"
              variant="destructive"
            >
              Sim
            </Button>
            <Button onClick={state.alterState} type="button">
              Não
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
 