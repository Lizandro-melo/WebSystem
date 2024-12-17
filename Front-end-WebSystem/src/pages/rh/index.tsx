import React, { useContext, useEffect, useState } from "react";

import { pageSelectProps, pageSelectRhGlobal } from "@/lib/globalStates";
import Cadastrar from "@/components/diversos/system/rh/cadastrar";
import Anotacoes from "@/components/diversos/system/rh/anotacoes";
import GestaoColaboradores from "@/components/diversos/system/rh/gestao-colaboradores";
import ContainerMain from "@/components/container/container-main";
import NavBarMain from "@/components/navbar/nav-bar-main";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { MainContext } from "@/provider/main-provider";

export default function Rh() {
  const { searchParams } = useContext(MainContext);
  const selectPage = pageSelectRhGlobal<pageSelectProps>((state) => state);

  const pathname = usePathname();
  const { replace } = useRouter();

  const alterPage = (state: boolean) => {
    const paramsPage = new URLSearchParams(searchParams);
    paramsPage.set("filter", String(state));
    replace(`${pathname}?${paramsPage.toString()}`);
  };

  return (
    <>
      <ContainerMain
        inputsClass="flex"
        navBar={<NavBarMain buttonBack />}
        // ferramentas={selectPage.page === "Anotações" ? {
        //     titulo: "RH",
        //     children: (
        //         <>
        //             <Button variant={"link"} title={"Filtrar"}
        //                     onClick={() => alterPage(true)}><Filter
        //                 className={"stroke-white w-[17px] h-[17px] active:scale-0"}/></Button>
        //         </>
        //     )
        // } : undefined}
      >
        {/* {selectPage.page === "Arquivos" && <ArquivosControle />} */}
        {selectPage.page === "Cadastro" && <Cadastrar />}
        {selectPage.page === "Anotações" && <Anotacoes />}
        {selectPage.page === "listaColaboradores" && <GestaoColaboradores />}
        <ModalFiltrarAnotacao />
      </ContainerMain>
    </>
  );
}

function ModalFiltrarAnotacao() {
  const { searchParams } = useContext(MainContext);
  const [stateModalFiltrar, setStateModalFiltrar] = useState<boolean>(false);
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    setStateModalFiltrar(eval(searchParams.get("filter") as string));
  }, [searchParams]);

  const alterPage = (state: boolean) => {
    const paramsPage = new URLSearchParams(searchParams);
    paramsPage.set("filter", String(state));
    replace(`${pathname}?${paramsPage.toString()}`);
  };

  return (
    <Dialog
      open={stateModalFiltrar}
      onOpenChange={() => {
        alterPage(false);
      }}
    >
      <DialogContent className="!max-w-[50rem] scale-[85%] bg-[var(--color-tec)]">
        <DialogTitle>Filtrar</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
