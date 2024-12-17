import {
  dadosRelatorioHorasTodosGlobal,
  dadosRelatorioHorasTodosProps,
  dadosRelatorioSegundaViaGlobal,
  dadosRelatorioSegundaViaProps,
} from "@/lib/globalStates";
import { formatarDataComum } from "@/lib/utils";
import { useEffect } from "react";
import Router from "next/router";

export default function RelatorioUnique() {
  const dadosTodos =
    dadosRelatorioHorasTodosGlobal<dadosRelatorioHorasTodosProps>(
      (state) => state,
    );
  let int = 0;

  useEffect(() => {
    if (int === 0) {
      setTimeout(() => {
        print();
        Router.back();
      }, 1000);
      int++;
    }
  }, [int]);

  return (
    <>
      {dadosTodos.todos?.map((dados, i) => {
        return (
          <main
            key={i}
            className="bg-gray-100 h-screen flex flex-col w-screen !text-black"
          >
            {Array.from({ length: 2 }).map((_, i) => {
              return (
                <section
                  key={i}
                  className="mx-auto p-4 bg-white rounded-lg shadow-md w-full h-full"
                >
                  <h1 className="text-lg font-semibold mb-4">
                    Relatório de Banco de Horas
                  </h1>

                  <table className="w-full mb-6">
                    <tbody>
                      <tr>
                        <td className="font-semibold pr-4">
                          Nome do Colaborador:
                        </td>
                        <td>
                          {dados.infoColaborador?.infoPessoais.nomeCompleto}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-4">
                          Data de Admissão:
                        </td>
                        <td>
                          {formatarDataComum(
                            dados.infoColaborador?.infoCLT?.dataAdmissao,
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-4">
                          Período Consultado:
                        </td>
                        <td>
                          {formatarDataComum(dadosTodos.dataInicial)} -{" "}
                          {formatarDataComum(dadosTodos.dataFinal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <h2 className="text-lg font-semibold mb-2">Banco de Horas</h2>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="font-semibold pr-4">Positivo do Mês:</td>
                        <td>
                          {dados.dadosContabilizados?.horasPositivas} minutos
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-4">Negativo do Mês:</td>
                        <td>
                          {dados.dadosContabilizados?.horasNegativas} minutos
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-4">
                          Banco de horas (Todo o periodo):
                        </td>
                        <td>{dados.dadosContabilizados?.bancoHoras} minutos</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-10 text-xl flex flex-col gap-3">
                    <span className="font-semibold text-lg relative after:absolute after:border-b after:border-black after:w-[300px] after:h-6 after:ml-2">
                      Assinatura do Colaborador:
                    </span>
                    <span className="font-semibold text-sm relative after:absolute after:border-b after:border-black after:w-[150px] after:h-4 after:ml-2">
                      Data:
                    </span>
                    <span className="font-semibold text-sm relative after:absolute after:border-b after:border-black after:w-[250px] after:h-4 after:ml-2">
                      Cidade:
                    </span>
                  </div>
                </section>
              );
            })}
          </main>
        );
      })}
    </>
  );
}
