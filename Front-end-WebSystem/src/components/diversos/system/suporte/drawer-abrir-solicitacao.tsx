import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {LabelInputPadrao} from "@/components/diversos/essential/label-input-padrao";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import ListAnexos from "@/components/diversos/essential/list-anexos";
import {useContext, useState} from "react";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {SolicitcaoTiModels} from "@/lib/models";
import {MainContext} from "@/provider/main-provider";
import axios from "axios";
import {stateLoundingGlobal} from "@/lib/globalStates";


export default function DrawerAbrirSolicitacao({setState, state}: {
    state: boolean,
    setState: () => void,
}) {

    const {register, handleSubmit, reset} = useForm();
    const {user, host, configToken} = useContext(MainContext);
    const displayLounding = stateLoundingGlobal((state: any) => state);
    const [anexoListItens, setAnexoListItens] = useState<File[]>([]);

    const updateFiles = async (): Promise<string[]> => {
        const updatedAnexos: string[] = [];
        for (let i = 0; i < anexoListItens.length; i++) {
            const formData = new FormData();
            formData.append("file", anexoListItens[i]);
            formData.append("dir", "C:/GrupoQualityWeb/outv2/assets/arquivosTicket");

            try {
                const response = await axios.post(`${host}/suporte/create/update/files`, formData, configToken);
                updatedAnexos.push(`arquivosTicket/${response.data}`);
            } catch (error) {
                throw new Error("Falha ao enviar o arquivo");
            }
        }
        return updatedAnexos;
    };

    const sendSolicitacao = async (data: { titulo: string; ocorrencia: string } | any) => {
        displayLounding.setDisplayLounding();
        let updatedAnexos: string[] = [];
        if (anexoListItens.length !== 0) {
            try {
                updatedAnexos = await updateFiles();
            } catch {
                displayLounding.setDisplayFailure("Falha na tentativa de enviar os documentos. Tente novamente!");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                displayLounding.setDisplayReset();
                return;
            }
        }
        
        const {titulo, ocorrencia} = data;
        const solicitacao: SolicitcaoTiModels = {
            titulo: titulo,
            ocorrencia: ocorrencia,
            solicitante: user?.fkAuth,
            anexos: updatedAnexos.length === 0 ? null : JSON.stringify(updatedAnexos),
        };
        await axios
            .post(`${host}/suporte/create/solicitacao`, solicitacao, configToken)
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                displayLounding.setDisplayReset();
                setState()
                setAnexoListItens([]);
                reset();
            })
            .catch(async (err) => {
                displayLounding.setDisplayFailure("Falha em abrir uma solicitação. Tente novamente!");
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset();
            });
    };


    return (
        <>
            <Dialog open={state} onOpenChange={setState}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Solicitar ticket</DialogTitle>
                    </DialogHeader>
                    <form method="POST" onSubmit={handleSubmit(sendSolicitacao)} className="flex flex-col gap-5">
                        <LabelInputPadrao.Root type="text" title="Titulo da solicitação" name="titulo"
                                               register={register}
                                               width={100} required={true}/>
                        <LabelInputPadrao.Root title="Ocorrencia" name="ocorrencia" register={register}
                                               width={100} textArea required={true}/>
                        <div className={cn("flex flex-col gap-4")}>
                            <Label>Anexos</Label>
                            <ListAnexos list={anexoListItens} alterList={setAnexoListItens}/>
                        </div>
                        <Button type="submit">Enviar</Button>
                    </form>
                </DialogContent>
            </Dialog>

        </>
    )
}