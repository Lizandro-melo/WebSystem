import React from "react";
import NiverDoMes from "@/components/diversos/catalog/NiverDoMes";
import ContainerMain from "@/components/container/container-main";
import NavBarMain from "@/components/navbar/nav-bar-main";

export default function Home() {
  return (
    <ContainerMain inputsClass="flex" navBar={<NavBarMain />}>
      <NiverDoMes />
    </ContainerMain>
  );
}
