import { NavBar } from "@/components/navbar/nav-bar-root";
import Router from "next/router";
import {
  Cog,
  Files,
  Grid2X2,
  Hammer,
  MessageCircleQuestion,
  Package,
  UsersRound,
} from "lucide-react";
import React, { useContext } from "react";
import {
  classStyleNavBarIcons,
  pageSelectEstoqueGlobal,
  pageSelectProps,
  pageSelectRhGlobal,
  stateModalAnotacaoRelatorioGlobal,
  stateModalHistoricoTicketGlobal,
  stateModalProps,
  stateModalSolicitarTicketGlobal,
  stateModalTrocaRamalGlobal,
} from "@/lib/globalStates";
import { MainContext } from "@/provider/main-provider";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function NavBarMain({ buttonBack }: { buttonBack?: boolean }) {
  const { acessos } = useContext(MainContext);

  //-------------State TI-------------//
  const stateAbrirSolicitacao =
    stateModalSolicitarTicketGlobal<stateModalProps>((state) => state);
  const stateModalHistoricoTicket =
    stateModalHistoricoTicketGlobal<stateModalProps>((state) => state);

  //-------------State RH-------------//
  const selectPage = pageSelectRhGlobal<pageSelectProps>((state) => state);
  const stateModalRelatorio =
    stateModalAnotacaoRelatorioGlobal<stateModalProps>((state) => state);

  //-------------State estoque-------------//
  const selectPageEstoque = pageSelectEstoqueGlobal<pageSelectProps>(
    (state) => state,
  );

  //-------------State Modal Portão-------------//
  const stateModalRamal = stateModalTrocaRamalGlobal<stateModalProps>(
    (state) => state,
  );

  return (
    <NavBar.Root buttonBack={buttonBack!}>
      <NavBar.Section
        itens={[
          <NavBar.Item
            key={0}
            testeRole={true}
            action={() => {
              Router.push("/configs/profile");
            }}
            title={"Perfil"}
          />,
          <NavBar.Item
            key={1}
            testeRole={acessos?.rolesTI?.delegado}
            action={() => {
              Router.push("/configs/roles");
            }}
            title={"Permições"}
          />,
        ]}
        title={"Configurações"}
        testeRole={true}
        icon={<Cog className={cn(classStyleNavBarIcons, "dark:invert-0")} />}
      />
      <NavBar.Section
        itens={[
          <NavBar.Item
            key={0}
            action={() => Router.push("/suporte")}
            title={"Acompanhar tickets"}
            testeRole={true}
          />,
          <NavBar.Item
            key={1}
            action={stateModalHistoricoTicket.alterState}
            title={"Historico solicitações"}
            testeRole={true}
          />,
          <NavBar.Item
            key={2}
            title={"Abrir solicitação"}
            action={() => stateAbrirSolicitacao.alterState()}
            testeRole={true}
          />,
        ]}
        title={"TI"}
        testeRole={true}
        icon={
          <MessageCircleQuestion
            className={cn(classStyleNavBarIcons, "dark:invert-0")}
          />
        }
      />
      <NavBar.Section
        title={"RH"}
        testeRole={acessos?.rolesRH?.delegado}
        icon={
          <UsersRound className={cn(classStyleNavBarIcons, "dark:invert-0")} />
        }
        itens={[
          <NavBar.Item
            key={0}
            title={"Anotações"}
            action={() => {
              Router.push("/rh");
              selectPage.setPage("Anotações");
            }}
            testeRole={true}
          />,
          <NavBar.Item
            key={1}
            title={"Cadastro"}
            action={() => {
              Router.push("/rh");
              selectPage.setPage("Cadastro");
            }}
            testeRole={acessos?.rolesRH?.cadastrarColaborador}
          />,
          <NavBar.Item
            key={2}
            title={"Lista de colaboradores"}
            action={() => {
              Router.push("/rh");
              selectPage.setPage("listaColaboradores");
            }}
            testeRole={true}
          />,
          <NavBar.Item
            key={3}
            title={"Gerar relatório"}
            action={() => {
              stateModalRelatorio.alterState();
            }}
            testeRole={acessos?.rolesRH?.gerarRelatorio}
          />,
        ]}
      />
      <NavBar.Section
        itens={[
          <NavBar.Item
            key={0}
            action={() => {
              selectPageEstoque.setPage("solicitar");
              Router.push("/estoque");
            }}
            title={"Solicitar Itens"}
            testeRole={true}
          />,
          <NavBar.Item
            key={1}
            action={() => {
              selectPageEstoque.setPage("listItens");
              Router.push("/estoque");
            }}
            title={"Controle de itens"}
            testeRole={acessos?.rolesEstoque?.controleItem}
          />,
          <NavBar.Item
            key={2}
            action={() => {
              selectPageEstoque.setPage("solicitacoes");
              Router.push("/estoque");
            }}
            title={"Solicitações"}
            testeRole={acessos?.rolesEstoque?.solicitacoes}
          />,
          <NavBar.Item
            key={3}
            action={() => {
              selectPageEstoque.setPage("minhasSolicitacoes");
              Router.push("/estoque");
            }}
            title={"Minhas solicitações"}
            testeRole={true}
          />,
          <NavBar.Item
            key={4}
            action={() => {
              selectPageEstoque.setPage("alerta");
              Router.push("/estoque");
            }}
            title={"Itens em alerta"}
            testeRole={acessos?.rolesEstoque?.itensAlertas}
          />,
        ]}
        title={"Estoque"}
        testeRole={true}
        icon={
          <Package className={cn(classStyleNavBarIcons, "dark:invert-0")} />
        }
      />
      <NavBar.Section
        title={"Diretrizes da empresa"}
        testeRole={true}
        icon={<Files className={cn(classStyleNavBarIcons, "dark:invert-0")} />}
        itens={[]}
      />
    </NavBar.Root>
  );
}
