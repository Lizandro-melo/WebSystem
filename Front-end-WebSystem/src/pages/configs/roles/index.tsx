import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "@/provider/main-provider";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ConfigsRolesRoot } from "@/components/diversos/configs/roles/configsRoles";
import ConfigPerfil from "@/components/diversos/configs/perfil/configPerfil";
import ContainerMain from "@/components/container/container-main";
import { ContainerContent } from "@/components/container/container-content";
import NavBarMain from "@/components/navbar/nav-bar-main";

export default function Roles() {

  return (
    <ContainerMain inputsClass="flex" navBar={<NavBarMain buttonBack />}>
      <ConfigsRolesRoot />
    </ContainerMain>
  );
}
