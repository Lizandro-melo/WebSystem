import {
  anotacaoSelectGlobal,
  AnotacaoSelectGlobalProps,
  colaboradorSelectGlobal,
  colaboradorSelectGlobalProps,
  dadosRelatorioHorasTodosGlobal,
  dadosRelatorioHorasTodosProps,
  dadosRelatorioSegundaViaGlobal,
  dadosRelatorioSegundaViaProps,
  stateLoundingGlobal,
  stateLoundingGlobalProps,
  stateModalAnotacaoGlobal,
  stateModalProps,
} from "@/lib/globalStates";
import { formatarDataComum } from "@/lib/utils";
import React, { useContext, useEffect, useState } from "react";
import Router from "next/router";
import { AnotacaoRhModels, InfoColaboradorCompletoDTO } from "@/lib/models";
import { MainContext } from "@/provider/main-provider";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AnexoBaixarAnotacao } from "@/components/diversos/system/rh/anotacoes";


export default function RelatorioUnique() {
  const state = stateModalAnotacaoGlobal<stateModalProps>((state) => state);
  const dadosSegundaVia =
    dadosRelatorioSegundaViaGlobal<dadosRelatorioSegundaViaProps>(
      (state) => state,
    );
  const anotacaoSelect = anotacaoSelectGlobal<AnotacaoSelectGlobalProps>(
    (state: any) => state,
  );
  const { host, configToken } = useContext(MainContext);

  useEffect(() => {
    dadosSegundaVia.anotacoes?.reverse();
  }, []);

  return (
    <>
      <ModalAnotacaoView />
      <main className=" h-screen flex flex-col w-screen bg-white !text-black overflow-auto">
        <section className="mx-auto p-10  rounded-lg w-full">
          <div className="flex w-full">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  "../../" +
                  dadosSegundaVia.infoColaborador?.infoPessoais.dirFoto
                }
                height={130}
                width={130}
                className={"w-[130px] h-[130px]"}
                alt="Foto do Colaborador"
              />
            </div>
            <div className=" h-full flex flex-col text-xs px-3">
              {dadosSegundaVia.infoColaborador?.infoPessoais.fkAuth && (
                <span>
                  Código de registro:{" "}
                  {dadosSegundaVia.infoColaborador?.infoPessoais.fkAuth}
                </span>
              )}
              <span>
                Nome:{" "}
                {dadosSegundaVia.infoColaborador?.infoPessoais.nomeCompleto}
              </span>
              {dadosSegundaVia.infoColaborador?.infoPessoais.dataNascimento && (
                <span>
                  Idade:{" "}
                  {new Date().getFullYear() -
                    parseInt(
                      dadosSegundaVia.infoColaborador?.infoPessoais.dataNascimento.split(
                        "-",
                      )[0],
                    )}{" "}
                  anos (
                  {
                    formatarDataComum(
                      dadosSegundaVia.infoColaborador?.infoPessoais
                        .dataNascimento,
                    )?.split(" ")[0]
                  }
                  )
                </span>
              )}

              {dadosSegundaVia.infoColaborador?.infoPessoais.cpf && (
                <span>
                  CPF: {dadosSegundaVia.infoColaborador?.infoPessoais.cpf}
                </span>
              )}
            </div>
            <div className="h-full flex flex-col text-xs px-3">
              {dadosSegundaVia.infoColaborador?.infoMEI ? (
                <>
                  {dadosSegundaVia.infoColaborador?.infoMEI?.dataAdmissao && (
                    <span>
                      Data de contratação:{" "}
                      {formatarDataComum(
                        dadosSegundaVia.infoColaborador?.infoMEI.dataAdmissao,
                      )}
                    </span>
                  )}
                  {dadosSegundaVia.infoColaborador?.infoMEI?.dataDemissao && (
                    <span>
                      Data de desligamento:{" "}
                      {formatarDataComum(
                        dadosSegundaVia.infoColaborador?.infoMEI.dataDemissao,
                      )}
                    </span>
                  )}
                  {dadosSegundaVia.infoColaborador?.infoMEI.empresa?.nome && (
                    <span>
                      Empresa:{" "}
                      {dadosSegundaVia.infoColaborador?.infoMEI.empresa.nome}
                    </span>
                  )}
                  {dadosSegundaVia.infoColaborador?.infoMEI.setor?.nome && (
                    <span>
                      Setor:{" "}
                      {dadosSegundaVia.infoColaborador?.infoMEI.setor.nome}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {dadosSegundaVia.infoColaborador?.infoCLT &&
                  !dadosSegundaVia.infoColaborador?.infoEstagiario?.status ? (
                    <>
                      {dadosSegundaVia.infoColaborador?.infoCLT
                        ?.dataAdmissao && (
                        <span>
                          Data de contratação:{" "}
                          {formatarDataComum(
                            dadosSegundaVia.infoColaborador?.infoCLT
                              .dataAdmissao,
                          )}
                        </span>
                      )}
                      {dadosSegundaVia.infoColaborador?.infoCLT
                        ?.dataDemissao && (
                        <span>
                          Data de desligamento:{" "}
                          {formatarDataComum(
                            dadosSegundaVia.infoColaborador?.infoCLT
                              .dataDemissao,
                          )}
                        </span>
                      )}
                      {dadosSegundaVia.infoColaborador?.infoCLT.empresa
                        ?.nome && (
                        <span>
                          Empresa:{" "}
                          {
                            dadosSegundaVia.infoColaborador?.infoCLT.empresa
                              .nome
                          }
                        </span>
                      )}
                      {dadosSegundaVia.infoColaborador?.infoCLT.setor?.nome && (
                        <span>
                          Setor:{" "}
                          {dadosSegundaVia.infoColaborador?.infoCLT.setor.nome}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {dadosSegundaVia.infoColaborador?.infoEstagiario
                        ?.dataAdmissao && (
                        <span>
                          Data de contratação:{" "}
                          {
                            dadosSegundaVia.infoColaborador?.infoEstagiario
                              .dataAdmissao
                          }
                        </span>
                      )}
                      {dadosSegundaVia.infoColaborador?.infoEstagiario
                        ?.dataDemissao && (
                        <span>
                          Data de desligamento:{" "}
                          {
                            dadosSegundaVia.infoColaborador?.infoEstagiario
                              .dataDemissao
                          }
                        </span>
                      )}
                      {dadosSegundaVia.infoColaborador?.infoEstagiario?.empresa
                        ?.nome && (
                        <span>
                          Empresa:{" "}
                          {
                            dadosSegundaVia.infoColaborador?.infoEstagiario
                              .empresa.nome
                          }
                        </span>
                      )}
                      {dadosSegundaVia.infoColaborador?.infoEstagiario?.setor
                        ?.nome && (
                        <span>
                          Setor:{" "}
                          {
                            dadosSegundaVia.infoColaborador?.infoEstagiario
                              .setor.nome
                          }
                        </span>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <hr className={"my-6"} />
          <h1>Relatorio geral</h1>
          <div className="h-full w-full flex justify-between relative">
            <div className="text-sm flex flex-col gap-2 py-5 w-[350px] ">
              <span>
                Data de consulta:{" "}
                {formatarDataComum(dadosSegundaVia.dataInicial)} a{" "}
                {formatarDataComum(dadosSegundaVia.dataFinal)}
              </span>
              <span>
                Banco positivo{" "}
                <span className="text-xs">
                  (Baseado no periodo consultado):{" "}
                  {dadosSegundaVia.dados?.horasPositivas} min
                </span>
              </span>
              <span>
                Banco negativo{" "}
                <span className="text-xs">
                  (Baseado no periodo consultado):{" "}
                  {dadosSegundaVia.dados?.horasNegativas} min
                </span>
              </span>
              <span>
                Banco de horas{" "}
                <span className="text-xs">
                  (Durante todo o periodo): {dadosSegundaVia.dados?.bancoHoras}{" "}
                  min
                </span>
              </span>
              <span>Hora extra: {dadosSegundaVia.dados?.horasExtras} min</span>
              <span>Quantidade de faltas: {dadosSegundaVia.dados?.faltou}</span>
              <span>
                Quantidade de atraso: {dadosSegundaVia.dados?.atrasos}
              </span>
              <span>
                Tempo de atraso: {dadosSegundaVia.dados?.atrasoTempo} min
              </span>
              <span>
                Quantidade de atestado (Horas):{" "}
                {dadosSegundaVia.dados?.atestadoHora}
              </span>
              <span>
                Quantidade de atestado (Dia): {dadosSegundaVia.dados?.atestado}
              </span>
              <span>
                Quantidade de suspenções: {dadosSegundaVia.dados?.suspensao}
              </span>
              <div className="my-5">
                <Button onClick={(event) => Router.back()}>Voltar</Button>
              </div>
            </div>
            <div className="w-[75%]  relative overflow-y-auto overflow-x-hidden  bg-[#eef1f6]">
              <div className="absolute w-full h-full">
                <Table className="relative">
                  <TableCaption>...</TableCaption>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="">
                        <span className="flex gap-2 relative items-center justify-center">
                          ID
                        </span>
                      </TableHead>

                      <TableHead className="">
                        <span className="flex gap-2 relative items-center justify-center">
                          Tipo
                        </span>
                      </TableHead>
                      <TableHead className=" ">
                        <span className=" flex gap-2 relative items-center justify-center">
                          Motivo
                        </span>
                      </TableHead>
                      <TableHead className=" ">
                        <span className=" flex gap-2 relative items-center justify-center">
                          Status
                        </span>
                      </TableHead>

                      <TableHead className="">
                        <span className="flex gap-2 relative items-center justify-center">
                          Date de inicio
                        </span>
                      </TableHead>
                      <TableHead className="">
                        <span className="flex gap-2 relative items-center justify-center">
                          Data final
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dadosSegundaVia?.anotacoes?.map((anotacao) => {
                      return (
                        <>
                          <TableRow
                            key={anotacao.id}
                            onClick={() => {
                              anotacaoSelect.setAnotacao(anotacao);
                              state.alterState();
                            }}
                            className={" cursor-pointer hover:bg-transparent"}
                          >
                            <TableCell className="max-w-[500px] overflow-hidden text-ellipsis">
                              <span className=" whitespace-nowrap ">
                                {anotacao.id}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-center flex items-center justify-center">
                                {anotacao.tipoAnotacao}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-center flex items-center justify-center">
                                {anotacao.motivo}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-center flex items-center justify-center">
                                {anotacao.status ? "Ativa" : "Inativa"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-center flex items-center justify-center">
                                {formatarDataComum(anotacao.dataInicio)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-center flex items-center justify-center">
                                {formatarDataComum(anotacao.dataFinal)}
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-transparent">
                            <TableCell className="max-w-[200px] hover:bg-transparent overflow-hidden text-ellipsis">
                              <span className=" whitespace-nowrap ">
                                {anotacao.id}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-[600px]">
                              <span className="  ">{anotacao.anotacao}</span>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export function ModalAnotacaoView() {
  const state = stateModalAnotacaoGlobal<stateModalProps>((state) => state);
  const anotacaoSelect = anotacaoSelectGlobal<AnotacaoSelectGlobalProps>(
    (state: any) => state,
  );
  const [anotacao, setAnotacao] = useState<AnotacaoRhModels>();

  const { host, configToken } = useContext(MainContext);
  useEffect(() => {
    setAnotacao(anotacaoSelect.anotacao!);
  }, [anotacaoSelect.anotacao]);

  return (
    <>
      <Dialog
        open={state.stateModal}
        onOpenChange={() => {
          state.alterState();
        }}
      >
        <DialogContent className="!max-w-[68rem] scale-[85%]">
          <DialogHeader>
            <DialogTitle>Anotação {anotacao?.id}#</DialogTitle>

            <div className="border rounded-xl p-3 w-full h-full relative flex flex-col gap-5 pb-20">
              <div className=" w-full flex flex-col gap-2">
                <Label className="text-sm">Ocorrencia:</Label>
                <span className="text-xs">{anotacao?.anotacao}</span>
              </div>
              <div className="flex w-full h-full">
                <div className="text-sm w-[50%] h-full flex flex-col gap-2">
                  <Label>Dados:</Label>
                  <ul className="flex gap-2 flex-col py-2">
                    <li className="flex gap-3 items-center">
                      <Input
                        type="checkbox"
                        className="checked:w-4 checked:h-4 w-4 h-4"
                        name="atestado"
                        id="atestado"
                        checked={anotacao?.atestado}
                      />
                      <Label className="text-xs" htmlFor="atestado">
                        Atestado de dias
                      </Label>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Input
                        type="checkbox"
                        className="checked:w-4 checked:h-4 w-4 h-4"
                        name="atestadoHora"
                        id="atestadoHora"
                        checked={anotacao?.atestadoHora}
                      />
                      <Label className="text-xs" htmlFor="atestadoHora">
                        Atestado de horas
                      </Label>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Input
                        type="checkbox"
                        className="checked:w-4 checked:h-4 w-4 h-4"
                        name="ferias"
                        id="ferias"
                        checked={anotacao?.ferias}
                      />
                      <Label className="text-xs" htmlFor="ferias">
                        Ferias
                      </Label>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Input
                        type="checkbox"
                        className="checked:w-4 checked:h-4 w-4 h-4"
                        name="suspensao"
                        id="suspensao"
                        checked={anotacao?.suspensao}
                      />
                      <Label className="text-xs" htmlFor="suspensao">
                        Suspensão
                      </Label>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Input
                        type="checkbox"
                        className="checked:w-4 checked:h-4 w-4 h-4"
                        name="licenca"
                        id="licenca"
                        checked={anotacao?.licenca}
                      />
                      <Label className="text-xs" htmlFor="licenca">
                        Licença
                      </Label>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Input
                        type="checkbox"
                        className="checked:w-4 checked:h-4 w-4 h-4"
                        name="advVerbal"
                        id="advVerbal"
                        checked={anotacao?.advVerbal}
                      />
                      <Label className="text-xs" htmlFor="advVerbal">
                        Advertência verbal
                      </Label>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Input
                        type="checkbox"
                        className="checked:w-4 checked:h-4 w-4 h-4"
                        name="advEscrita"
                        id="advEscrita"
                        checked={anotacao?.advEscrita}
                      />
                      <Label className="text-xs" htmlFor="advEscrita">
                        Advertência escrita
                      </Label>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Input
                        type="checkbox"
                        className="checked:w-4 checked:h-4 w-4 h-4"
                        name="atraso"
                        id="atraso"
                        checked={anotacao?.atraso}
                      />
                      <Label className="text-xs" htmlFor="atraso">
                        Atraso
                      </Label>
                    </li>
                    {anotacao?.advEscrita && (
                      <li className="flex gap-2 items-center">
                        <Label htmlFor="dataFinal">Data da adv. escrita:</Label>
                        <span className="text-xs">
                          {formatarDataComum(anotacao?.advEscritaData)}
                        </span>
                      </li>
                    )}
                    {anotacao?.atraso && (
                      <li className="flex gap-2 items-center">
                        <Label htmlFor="dataFinal">Tempo de atraso:</Label>
                        <span className="text-xs">
                          {anotacao?.atrasoTempo} min
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="text-sm w-[50%] h-full flex flex-col gap-2">
                  <Label>Informações:</Label>
                  <ul className="flex gap-2 flex-col py-2">
                    {(anotacao?.horaExtra || anotacao?.horaExtra! > 0) && (
                      <li className="flex gap-2 items-center">
                        <Label htmlFor="horaExtra">Hora extra:</Label>
                        <span className="text-xs">
                          {anotacao?.horaExtra} min
                        </span>
                      </li>
                    )}
                    {(anotacao?.bancoPositivo ||
                      anotacao?.bancoPositivo! > 0) && (
                      <li className="flex gap-2 items-center">
                        <Label htmlFor="bancoPositivo">Banco positivo:</Label>
                        <span className="text-xs">
                          {anotacao?.bancoPositivo} min
                        </span>
                      </li>
                    )}
                    {(anotacao?.bancoNegativo ||
                      anotacao?.bancoNegativo! > 0) && (
                      <li className="flex gap-2 items-center">
                        <Label htmlFor="bancoNegativo">Banco negativo:</Label>
                        <span className="text-xs">
                          {anotacao?.bancoNegativo} min
                        </span>
                      </li>
                    )}

                    <li className="flex gap-2 items-center">
                      <Label htmlFor="dataInicio">Data de inicio:</Label>
                      <span className="text-xs">
                        {formatarDataComum(anotacao?.dataInicio)}
                      </span>
                    </li>
                    <li className="flex gap-2 items-center">
                      <Label htmlFor="dataFinal">Data de final:</Label>
                      <span className="text-xs">
                        {formatarDataComum(anotacao?.dataFinal)}
                      </span>
                    </li>
                  </ul>
                  {anotacao?.anexo && anotacao?.anexo!.length > 0 && (
                    <AnexoBaixarAnotacao anexos={JSON.parse(anotacao.anexo!)} />
                  )}
                </div>
              </div>
              <div className="absolute bottom-2">
                <Button onClick={() => state.alterState()}>Voltar</Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
