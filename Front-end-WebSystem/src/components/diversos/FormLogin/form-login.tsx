/* eslint-disable @next/next/no-img-element */
import { LabelInputPadrao } from "@/components/diversos/essential/label-input-padrao";
import { Button } from "@/components/ui/button";
import { FieldValues, useForm } from "react-hook-form";
import { useCallback, useContext, useState } from "react";
import { MainContext } from "@/provider/main-provider";
import SwitchThemes from "../essential/switch-themes";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ContainerContent } from "@/components/container/container-content";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { router } from "next/client";
import { AcessoModel, InfoColaborador } from "@/lib/models";
import { setCookie } from "nookies";
import {
  stateAlertDialogGlobal,
  stateAlertDialogGlobalProps,
  stateLoundingGlobal,
  stateLoundingGlobalProps,
} from "@/lib/globalStates";

export default function FormLoginRoot() {
  // UseForm é uma biblioteca responsável por lidar com formulários, facilitando a capitalização dos valores de todos os campos do formulário de forma fácil.
  const { register, handleSubmit, reset } = useForm();
  const { singIn, themes } = useContext(MainContext);
  const [redefinirSenha, setRedefinirSenha] = useState(false);
  const [redefinirSenhaConfirm, setRedefinirSenhaConfirm] = useState(false);
  const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
    (state: any) => state,
  );

  return (
    <ContainerContent inputsClass="flex items-center justify-center">
      {/* Modal de redefinir senha, ao clicar no botão de redefinir senha o statado "redefinirSenha" vira true e assim abrindo o modal  */}
      <RedefinirSenha
        state={redefinirSenha}
        setState={setRedefinirSenha}
        stateConfirm={redefinirSenhaConfirm}
        setStateConfirm={setRedefinirSenhaConfirm}
      />
      <RedefinirSenhaComfirm
        state={redefinirSenhaConfirm}
        setState={setRedefinirSenhaConfirm}
      />
      <div className="w-[65%] max-md:w-full h-[65%] bg-[var(--color-sec)] relative max-md:items-center flex max-md:flex-col rounded-[20px] shadow-2xl">
        <div className="w-[50%] h-full max-md:shadow-none max-md:!bg-transparent max-md:h-[35%] bg-[var(--color-tec)]  rounded-l-[20px] bg-[#e7ecf1] flex justify-center items-center shadow-lg ">
          {/*  Dependendo do tema armazenado nos Cookies ele selecionara */}
          <img
            src="https://placehold.co/300x300"
            alt="Logo da empresa"
            width={300}
            height={300}
            className="drop-shadow-xl"
          />
        </div>
        <form
          // Ao efetuar o login ele irá disparar a função singIn, a handleSubmit só está ai para suporte.
          onSubmit={handleSubmit(singIn)}
          method="POST"
          className="w-[50%] h-full flex justify-center max-md:w-full max-md:h-[50%] items-center flex-col gap-4 z-40"
        >
          {/*<SwitchThemes*/}
          {/*    inputsClass="absolute top-5 right-5 "*/}
          {/*    textClass="dark:!text-white"*/}
          {/*/>*/}
          <LabelInputPadrao.Root
            register={register}
            name={"login"}
            title={"Login"}
            type={"text"}
            width={70}
          />
          <LabelInputPadrao.Root
            register={register}
            name={"password"}
            title={"Senha"}
            type={"password"}
            width={70}
          />
          <div className="flex  gap-4 w-[70%]">
            <Button type="submit" className="w-[60%]">
              Entrar
            </Button>
            <Button
              onClick={() => {
                setRedefinirSenha(true);
                reset();
              }}
              type="button"
              className="w-[40%]"
              variant="link"
            >
              Redefinir senha
            </Button>
          </div>
        </form>
      </div>
    </ContainerContent>
  );
}

function RedefinirSenha({
  state,
  setState,
  stateConfirm,
  setStateConfirm,
}: {
  state: boolean;
  setState: (status: boolean) => void;
  stateConfirm: boolean;
  setStateConfirm: (status: boolean) => void;
}) {
  const { register, handleSubmit, reset } = useForm();
  const { host, configToken } = useContext(MainContext);
  const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
    (state: any) => state,
  );

  const redefinirSenha = useCallback(
    async (data: FieldValues) => {
      displayLounding.setDisplayLounding();
      await axios
        .get(`${host}/auth/sendotp?cpf=${data.cpf}`)
        .then(async (response) => {
          displayLounding.setDisplaySuccess(response.data);
          setState(false);
          setStateConfirm(true);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
          setTimeout(async () => {
            await axios.get(`${host}/auth/deleteotp?cpf=${data.cpf}`);
          }, 300000);
          reset();
        })
        .catch(async (err) => {
          displayLounding.setDisplayFailure(err.response.data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          displayLounding.setDisplayReset();
        });
    },
    [configToken, host, setState, setStateConfirm],
  );

  return (
    <Dialog open={state} onOpenChange={() => setState(false)}>
      <DialogContent>
        <form
          method="post"
          onSubmit={handleSubmit(redefinirSenha)}
          className="flex items-center gap-10 justify-center flex-col p-5"
        >
          <DialogTitle>Redefinir Senha</DialogTitle>
          <LabelInputPadrao.Root
            register={register}
            name={"cpf"}
            title={"Digite seu CPF"}
            type={"text"}
            width={70}
          />
          <div className="flex justify-center gap-4 w-[70%]">
            <Button type="submit" className="w-[60%]">
              Enviar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Informações que são retornadas do back-end ao logar
type ResponseAlter = {
  mensagem: string;
  fkAuth: number;
  login: string;
};

function RedefinirSenhaComfirm({
  state,
  setState,
}: {
  state: boolean;
  setState: (status: boolean) => void;
}) {
  const { register, handleSubmit } = useForm();
  const { host, configToken } = useContext(MainContext);

  const [valueOtp, setValueOtp] = useState<string>();
  const displayLounding = stateLoundingGlobal<stateLoundingGlobalProps>(
    (state: any) => state,
  );

  const sendOtp = async (data: FieldValues) => {
    displayLounding.setDisplayLounding();
    await axios
      .get(`${host}/auth/findotp?otp=${valueOtp}`)
      .then(async (response) => {
        alert(`Copie sua senha temporaria: ${response.data}`);
        setState(false);
        displayLounding.setDisplayReset();
      })
      .catch(async (err) => {
        displayLounding.setDisplayFailure(err.response.data);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        displayLounding.setDisplayReset();
      });
  };

  return (
    <>
      <Dialog open={state} onOpenChange={() => setState(false)}>
        <DialogContent>
          <form
            method="post"
            onSubmit={handleSubmit(sendOtp)}
            className="flex items-center gap-10 justify-center flex-col p-5"
          >
            <DialogTitle>Código OTP</DialogTitle>
            <InputOTP
              maxLength={6}
              value={valueOtp}
              onChange={(e) => setValueOtp(e)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="flex justify-center gap-4 w-[70%]">
              <Button type="submit" className="w-[60%]">
                Enviar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
