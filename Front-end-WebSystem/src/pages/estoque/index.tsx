import React from "react";

import {pageSelectEstoqueGlobal, pageSelectProps} from "@/lib/globalStates";
import ModalGerarRelatorioRh from "@/components/diversos/system/rh/modal-gerar-relatorio-rh";
import SolicitarItemEstoque from "@/components/diversos/system/estoque/solicitar-item-estoque";
import SolicitacoesEstoque from "@/components/diversos/system/estoque/solicitacoes-estoque";
import MinhasSolicitacoesEstoque from "@/components/diversos/system/estoque/minhas-solicitacoes-estoque";
import AlertaEstoque from "@/components/diversos/system/estoque/alerta-estoque";
import ItensEstoque from "@/components/diversos/system/estoque/itens-estoque";
import ContainerMain from "@/components/container/container-main";
import {ContainerContent} from "@/components/container/container-content";
import NavBarMain from "@/components/navbar/nav-bar-main";

export default function Estoque() {
    const selectPage = pageSelectEstoqueGlobal<pageSelectProps>((state) => state);

    return (
        <>
            <ContainerMain inputsClass="flex" navBar={<NavBarMain buttonBack/>}>
                {selectPage.page === "solicitar" && <SolicitarItemEstoque/>}
                {selectPage.page === "solicitacoes" && <SolicitacoesEstoque/>}
                {selectPage.page === "minhasSolicitacoes" && (
                    <MinhasSolicitacoesEstoque/>
                )}
                {/*{selectPage.page === "movimentacao" && <MovimentacaoEstoque/>} */}
                {selectPage.page === "alerta" && <AlertaEstoque/>}
                {selectPage.page === "listItens" && <ItensEstoque/>}
            </ContainerMain>
        </>
    );
}
