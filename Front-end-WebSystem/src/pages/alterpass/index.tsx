import React, {useCallback, useContext, useEffect} from "react";
import {MainContext} from "@/provider/main-provider";
import axios from "axios";
import Router from "next/router";
import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {stateLoundingGlobal} from "@/lib/globalStates";
import {ContainerContent} from "@/components/container/container-content";

export default function Configs() {

    const {alterPass, host, user, configToken, disconnect} = useContext(MainContext)

    const {register, handleSubmit} = useForm()

    const displayLounding = stateLoundingGlobal((state: any) => state)

    useEffect(() => {

        if (!alterPass) {
            Router.push("/home")
        }
    }, [alterPass])

    const alterSenha = useCallback(async (data: any) => {
        displayLounding.setDisplayLounding()
        const senhas = {
            ...data,
            idColaborador: user?.fkAuth!
        }
        await axios.put(`${host}/auth/alterpass`, senhas, configToken).then(async (response) => {
            displayLounding.setDisplaySuccess(response.data)
            await new Promise(resolve => setTimeout(resolve, 2000))
            displayLounding.setDisplayReset()
            Router.push("/home")
        }).catch(async (err) => {
            displayLounding.setDisplayFailure(err.response.data)
            await new Promise(resolve => setTimeout(resolve, 2000))
            displayLounding.setDisplayReset()
        })
    }, [configToken, host, user?.fkAuth])

    return (
        <>
            <ContainerContent inputsClass="flex items-center justify-center">
                <div className={"w-full h-full flex justify-center items-center"}>
                    <form
                        onSubmit={handleSubmit(alterSenha)}
                        className="w-[40%] border bg-[#f1f4f9]  dark:bg-slate-900 p-10 flex flex-col gap-5 rounded-xl">
                        <h2>Alterar senha</h2>
                        <LabelInputPadrao.Root name={"novaSenha"} title={"Nova senha"} width={100} required
                                               register={register} type={"password"}/>
                        <LabelInputPadrao.Root name={"confirmSenha"} title={"Confirme a nova senha"} width={100}
                                               required
                                               register={register} type={"password"}/>
                        <div className={cn("flex gap-3 w-full")}>
                            <Button>
                                Alterar senha
                            </Button>
                            <Button variant="link" onClick={disconnect} type="button">
                                desconectar
                            </Button>
                        </div>
                    </form>
                </div>
            </ContainerContent>
        </>
    )
}
