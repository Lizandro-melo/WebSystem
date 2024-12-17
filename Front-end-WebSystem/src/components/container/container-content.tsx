import { cn } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "@/provider/main-provider";
import { BellRing, Bolt, DoorOpen, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  stateAlertDialogGlobal,
  stateAlertDialogGlobalProps,
  stateItensSolicitacaoEstoqueGlobal,
  stateModalFinalizarSolicitacaoEstoqueGlobal,
  stateModalNotifyGlobal,
  stateModalProps,
  stateModalSelecionarItemEstoqueGlobal,
  stateNavBarGlobal,
  stateNotifyDateGlobal,
  stateNotifyDateProps,
} from "@/lib/globalStates";
import { ItemSolicitadoEstoqueModel } from "@/lib/models";
import Router from "next/router";
import SwitchThemes from "@/components/diversos/essential/switch-themes";

type ContainerContextRootProps = {
  children?: React.ReactNode;
  inputsClass?: string;
};

export function ContainerContent({
  children,
  inputsClass,
}: ContainerContextRootProps) {
  const state = stateNavBarGlobal((state: any) => state);

  return (
    <>
      <div
        onMouseOver={() => state.setBool(false)}
        className={cn(
          "flex flex-col w-full h-full items-start",
          // state.stateNavBar && "w-[80%] items-end",
        )}
      >
        <div className={cn("flex flex-col w-full h-full")}>
          <main className="w-full h-full flex items-center justify-center">
            <div
              className={cn("w-[95%] h-[95%] rounded-md flex", inputsClass!)}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
