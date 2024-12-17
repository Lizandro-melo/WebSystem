import ListColaboradoresAtivos from "@/components/diversos/essential/ListColaboradoresAtivos";
import React, {
    ChangeEvent,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {
    FileText,
    Plus,
    RotateCcw,
    RotateCw,
    Sheet,
    Trash,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {
    colaboradorSelectGlobal,
    colaboradorSelectGlobalProps,
    pageSelectProps,
    stateAlertDialogGlobal,
    stateAlertDialogGlobalProps,
    stateLoundingGlobal,
    stateModalDocExistenteProps,
    stateModalImportDocExistenteRhGlobal,
    stateModalImportDocRhGlobal,
    stateModalProps,
} from "@/lib/globalStates";
import {
    DocExpirandoAlertRhDTO,
    DocRhModels,
    SubstituirDocRhDTO,
    TipoDocRhDTO,
} from "@/lib/models";
import {useForm} from "react-hook-form";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import axios from "axios";
import {MainContext} from "@/provider/main-provider";
import {useQuery, useQueryClient} from "react-query";
import Router from "next/router";
import ContainerSystem from "@/components/container/container-system";


export default function ArquivosControle() {
    return (
        <>
            <ListColaboradoresAtivos tipoSelect/>
            <ArquivosReferents/>
        </>
    );
}

type filterProps = {
    apelido: string;
    tipo: string;
};

function ArquivosReferents() {
    const queryClient = useQueryClient();
    const stateAlert = stateAlertDialogGlobal<stateAlertDialogGlobalProps>(
        (state) => state,
    );
    const state = stateModalImportDocRhGlobal((state) => state);
    const {colaborador} = colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
        (state: any) => state,
    );
    const {host, acessos, configToken} = useContext(MainContext);
    const [filter, setFilter] = useState<filterProps>({apelido: "", tipo: ""});
    const displayLounding = stateLoundingGlobal((state: any) => state);
    const {data: docs, refetch: refetchDocs} = useQuery<DocRhModels[]>({
        queryKey: ["docsRh"],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `${host}/rh/find/doc?id=${colaborador?.fkAuth}`,
                    configToken,
                );
                return response.data.map((doc: DocRhModels) => {
                    switch (doc.tipo) {
                        case "IDENTIDADE":
                            doc.tipo = "Identidade";
                            break;
                        case "TITULOELEITOR":
                            doc.tipo = "Título de eleitor";
                            break;
                        case "COMPROVANTERESIDENCIA":
                            doc.tipo = "Comprovante de residencia";
                            break;
                        case "EXAMECOMPLEMENTAR":
                            doc.tipo = "Exame Complementar";
                            break;
                        case "DECLARACAO":
                            doc.tipo = "Declaração";
                            break;
                        case "CONTRATO":
                            doc.tipo = "Contrato";
                            break;
                    }
                    return doc;
                });
            } catch (error) {
                return null;
            }
        },
        enabled: !!colaborador?.fkAuth && !!host,
    });
    const {data: docsAlert, refetch: refetchDocsAlert} = useQuery<
        DocExpirandoAlertRhDTO[]
    >({
        queryKey: ["docsAlert"],
        queryFn: async () => {
            try {
                const response = await axios
                    .get(
                        `${host}/rh/find/doc/alert?id=${colaborador?.fkAuth}`,
                        configToken,
                    )
                    .then((response) => response.data);
                return response.map((docAlert: DocExpirandoAlertRhDTO) => {
                    switch (docAlert?.doc!.tipo) {
                        case "IDENTIDADE":
                            docAlert.doc.tipo = "Identidade";
                            break;
                        case "TITULOELEITOR":
                            docAlert.doc.tipo = "Título de eleitor";
                            break;
                        case "COMPROVANTERESIDENCIA":
                            docAlert.doc.tipo = "Comprovante de residencia";
                            break;
                        case "EXAMECOMPLEMENTAR":
                            docAlert.doc.tipo = "Exame Complementar";
                            break;
                        case "DECLARACAO":
                            docAlert.doc.tipo = "Declaração";
                            break;
                        case "CONTRATO":
                            docAlert.doc.tipo = "Contrato";
                            break;
                    }
                    return docAlert;
                });
            } catch (error) {
                return null;
            }
        },
        enabled: !!colaborador?.fkAuth && !!host,
    });

    useEffect(() => {
        if (colaborador?.fkAuth && host) {
            refetchDocs();
            refetchDocsAlert();
        }
        if (state.stateModal) {
            refetchDocs();
            refetchDocsAlert();
        }
    }, [colaborador?.fkAuth, state.stateModal]);

    const applyFilter = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (!docs) return;

            const {name, value} = e.target;

            const filteredData = docs.filter((doc: DocRhModels) => {
                return (
                    (name === "apelido"
                        ? doc.apelido?.toLowerCase().includes(value.toLowerCase())
                        : true) &&
                    (name === "tipo"
                        ? doc.tipo?.toLowerCase().includes(value.toLowerCase())
                        : true)
                );
            });

            setFilter((prevState: any) => ({
                ...prevState,
                [name]: value,
            }));

            queryClient.setQueryData(["docsRh"], filteredData);

            if (filteredData.length === 0) {
                console.log("No data found, refetching...");
                if (filter.tipo === "" && filter.apelido === "") {
                    refetchDocs();
                }
            }
        },
        [filter.apelido, filter.tipo, queryClient, refetchDocs],
    );

    const deletarDoc = useCallback(
        (doc: DocRhModels) => {
            stateAlert.setAlert(
                "Atenção",
                `Tem certeza que deseja deletar o documento ${doc.apelido}?`,
                async () => {
                    displayLounding.setDisplayLounding();
                    await axios
                        .delete(`${host}/rh/update/delete/doc?id=${doc.id}`, configToken)
                        .then(async (response) => {
                            displayLounding.setDisplaySuccess(response.data);
                            await new Promise((resolve) => setTimeout(resolve, 2000));
                            refetchDocs();
                            refetchDocsAlert();
                            displayLounding.setDisplayReset();
                        })
                        .catch(async () => {
                            displayLounding.setDisplayFailure(
                                "Não foi possivel deeltar esté documento",
                            );
                            await new Promise((resolve) => setTimeout(resolve, 2000));
                            displayLounding.setDisplayReset();
                        });
                },
            );
        },
        [configToken],
    );

    const baixarDoc = async (doc: DocRhModels) => {
        displayLounding.setDisplayLounding();
        await axios
            .get(`${host}/rh/find/download/arquivo?name=${doc.dir}`)
            .then(() => {
                displayLounding.setDisplaySuccess("Baixado");
                Router.push(`${host}/rh/find/download/arquivo?name=${doc.dir}`);
                displayLounding.setDisplayReset();
            })
            .catch(async () => {
                displayLounding.setDisplayFailure("Este documento já não existe mais!");
                await new Promise((resolve) => setTimeout(resolve, 2000));
                displayLounding.setDisplayReset();
            });
    };

    // @ts-ignore
    return (
        <>
            {colaborador && (
                <>
                    <ModalImportDocument/>
                    <ContainerSystem>
                        <div className="w-full flex justify-start mb-5 items-center gap-5">
                            <div className="flex justify-between items-center bg-stone-300 rounded-full">
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            colaborador?.dirFoto
                                                ? colaborador?.dirFoto
                                                : "https://placehold.co/600?text=Foto"
                                        }
                                    />
                                </Avatar>
                                <span className="text-center text-sm mx-5">
                  {colaborador?.nomeCompleto}
                </span>
                            </div>
                            <p className="text-stone-500 text-xs">
                                Coloque o mouse por cima do documento para pré-visualizalo
                            </p>
                        </div>

                        <ScrollArea
                            className="h-[60%] w-full rounded-md border relative overflow-y-scroll scrowInvivel">
                            <div className="p-3 absolute w-full">
                                <h4 className="mb-4 text-sm font-medium leading-none">
                                    Documentos
                                </h4>
                                <Table className="relative">
                                    <TableHeader className="text-xs sticky top-0">
                                        <TableHead>
                                            <Input
                                                className="border-none bg-transparent focus-visible:!ring-0 text-xs"
                                                placeholder="Apelido"
                                                type="text"
                                                name="apelido"
                                                onChange={applyFilter}
                                            />
                                        </TableHead>
                                        <TableHead>
                      <span className="flex gap-2 relative items-center justify-between">
                        <Input
                            className="border-none bg-transparent focus-visible:!ring-0 text-xs"
                            placeholder="Tipo de documento"
                            type="text"
                            name="tipo"
                            list="tipos"
                            onChange={applyFilter}
                        />
                        <datalist id="tipos">
                          <option value="Identidade">Identidade</option>
                          <option value="CPF">CPF</option>
                          <option value="CNH">CNH</option>
                          <option value="Título de eleitor">
                            Título de eleitor
                          </option>
                          <option value="Comprovante de residencia">
                            Comprovante de residencia
                          </option>
                          <option value="Exame complementar">
                            Exame complementar
                          </option>
                          <option value="Declaração">Declaração</option>
                          <option value="Contrato">Contrato</option>
                          <option value="Certificado">Certificado</option>
                        </datalist>
                      </span>
                                        </TableHead>
                                        <TableHead>Data de emissão</TableHead>
                                        <TableHead>Data de vencimento</TableHead>
                                        <TableHead>Deletar</TableHead>
                                    </TableHeader>
                                    <TableBody>
                                        {docs
                                            ?.sort((a, b) => {
                                                return a.apelido! >= b.apelido! ? 1 : -1;
                                            })
                                            .map((doc: DocRhModels) => {
                                                const fileName = `${doc.dir?.split("/")[4]}/${
                                                    doc.dir?.split("/")[5]
                                                }`;
                                                return (
                                                    <>
                                                        <TableRow
                                                            key={doc.id}
                                                            className="hover:bg-stone-400 cursor-pointer"
                                                            title="Baixar"
                                                        >
                                                            <TableCell onClick={() => baixarDoc(doc)}>
                                                                {doc.apelido}
                                                            </TableCell>
                                                            <TableCell onClick={() => baixarDoc(doc)}>
                                                                {doc.tipo}
                                                            </TableCell>
                                                            <TableCell onClick={() => baixarDoc(doc)}>
                                                                {doc.dataEmissao}
                                                            </TableCell>
                                                            <TableCell onClick={() => baixarDoc(doc)}>
                                                                {doc.dataVencimento}
                                                            </TableCell>
                                                            <TableCell>
                                                                {acessos?.rolesRH.deletarDocumento && (
                                                                    <Button
                                                                        onClick={() => deletarDoc(doc)}
                                                                        className={"w-[50px] h-[30px]"}
                                                                        title={"Deletar"}
                                                                    >
                                                                        <Trash/>
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </div>
                        </ScrollArea>
                        <Button
                            variant="default"
                            onClick={() => state.alterState()}
                            className="w-full bg-stone-300 h-[5%] text-black hover:bg-stone-300"
                        >
                            Importar um documento
                        </Button>
                        <ScrollArea
                            className="h-[35%] w-full rounded-md border relative overflow-y-scroll scrowInvivel">
                            <div className="p-3 absolute w-full">
                                <h4 className="mb-4 text-sm font-medium leading-none">
                                    Alertas
                                </h4>
                                <Table>
                                    <TableHeader>
                                        <TableHead>Apelido</TableHead>
                                        <TableHead>Tipo de documento</TableHead>
                                        <TableHead>Tempo até o vencimento</TableHead>
                                    </TableHeader>
                                    <TableBody>
                                        {docsAlert?.map((doc: DocExpirandoAlertRhDTO) => {
                                            return (
                                                <>
                                                    <TableRow
                                                        key={doc.doc?.id}
                                                        className="bg-red-300 hover:bg-red-400 cursor-pointer"
                                                        title="Baixar"
                                                        onClick={async () => {
                                                            displayLounding.setDisplayLounding();
                                                            await axios
                                                                .get(
                                                                    `${host}/rh/find/download/arquivo?name=${doc.doc?.dir}`,
                                                                )
                                                                .then(() => {
                                                                    displayLounding.setDisplaySuccess("Baixado");
                                                                    Router.push(
                                                                        `${host}/rh/find/download/arquivo?name=${doc.doc?.dir}`,
                                                                    );
                                                                    displayLounding.setDisplayReset();
                                                                })
                                                                .catch(async () => {
                                                                    displayLounding.setDisplayFailure(
                                                                        "Este documento já não existe mais!",
                                                                    );
                                                                    await new Promise((resolve) =>
                                                                        setTimeout(resolve, 2000),
                                                                    );
                                                                    displayLounding.setDisplayReset();
                                                                });
                                                        }}
                                                    >
                                                        <TableCell>{doc.doc?.apelido}</TableCell>
                                                        <TableCell>{doc.doc?.tipo}</TableCell>
                                                        {doc.diasRestantes <= 0 ? (
                                                            <TableCell>Vencido</TableCell>
                                                        ) : (
                                                            <TableCell>{doc.diasRestantes} Dias</TableCell>
                                                        )}
                                                    </TableRow>
                                                </>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </ScrollArea>
                    </ContainerSystem>
                </>
            )}
            {!colaborador && <ContainerSystem>Documentos</ContainerSystem>}
        </>
    );
}

function ModalImportDocument() {
    const state = stateModalImportDocRhGlobal((state) => state);
    const colaboradorSelect =
        colaboradorSelectGlobal<colaboradorSelectGlobalProps>(
            (state: any) => state,
        );
    const stateImportDocExistente =
        stateModalImportDocExistenteRhGlobal<stateModalDocExistenteProps>(
            (state) => state,
        );
    const {register, handleSubmit, reset} = useForm();
    const [requeredVencimento, setRequeredVencimento] = useState(false);
    const {host, configToken} = useContext(MainContext);
    const displayLounding = stateLoundingGlobal((state: any) => state);
    const [doc, setDoc] = useState<DocRhModels>();

    const updateFile = async (e: ChangeEvent<HTMLInputElement>) => {
        displayLounding.setDisplayLounding();

        const formData = new FormData();
        if (e.target.files) {
            formData.append("file", e.target.files[0]);
        }
        formData.append(
            "dir",
            `C:/GrupoQualityWeb/outv2/assets/rh/doc/${colaboradorSelect.colaborador?.fkAuth}`,
        );

        await axios
            .post(`${host}/rh/update/doc`, formData, configToken)
            .then(async (response) => {
                setDoc((prevState: any) => ({
                    ...prevState,
                    dir: `/assets/rh/doc/${colaboradorSelect.colaborador?.nomeCompleto}/${response.data}`,
                }));
                displayLounding.setDisplaySuccess("Importado");
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            })
            .catch(async () => {
                displayLounding.setDisplayFailure("Falha ao enviar o arquivo");
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
                throw new Error("Falha ao enviar o arquivo");
            });
    };

    const enviarDoc = async (data: any) => {
        displayLounding.setDisplayLounding();

        const document: DocRhModels = {
            ...data,
            dir: doc?.dir,
            referentColaborador: colaboradorSelect.colaborador?.fkAuth!,
        };
        if (doc?.dir === null) {
            displayLounding.setDisplayFailure("Importe um documento!");
            await new Promise((resolve) => setTimeout(resolve, 1500));
            displayLounding.setDisplayReset();
            return;
        }
        await axios
            .post(`${host}/rh/create/doc`, document, configToken)
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                state.alterState();
                displayLounding.setDisplayReset();
                setDoc((prevState: any) => ({
                    ...prevState,
                    dir: null,
                    tipo: "",
                }));
                reset();
                // refetchDocs()
                // refetchDocsAlert()
            })
            .catch(async (erro) => {
                displayLounding.setDisplayReset();
                const response: TipoDocRhDTO = erro.response?.data;
                stateImportDocExistente.setDados(response.tipo, response.doc, document);
                stateImportDocExistente.alterState();
            });
    };

    return (
        <>
            <ModalImportDocExistentes/>
            <Dialog open={state.stateModal} onOpenChange={state.alterState}>
                <DialogContent className="!max-w-[60rem] min-h-[60%]">
                    <DialogHeader>
                        <DialogTitle>Importar um documento</DialogTitle>
                        <DialogDescription>
                            Aqui você irá conseguir importar um documento e armazenar em nosso
                            servidor!
                        </DialogDescription>
                        <div className="border rounded-xl p-5 w-full h-full flex justify-around">
                            <div className="w-[35%] h-full">
                                {!doc?.dir && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border border-stone-300 h-full w-full flex items-center justify-center flex-none rounded-md"
                                    >
                                        <Plus className="w-10 absolute z-[10]"/>
                                        <Input
                                            type="file"
                                            onChange={(e) => updateFile(e)}
                                            className="text-white z-[20] cursor-pointer bg-transparent file:hidden w-full h-full border border-none"
                                        />
                                    </Button>
                                )}
                                {doc?.dir && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border border-stone-300 h-full w-full flex items-center justify-center flex-none rounded-md relative"
                                    >
                                        <Input
                                            type="file"
                                            onChange={(e) => updateFile(e)}
                                            className="text-white z-[40] cursor-pointer bg-transparent file:hidden w-full h-full border border-none"
                                        />
                                        {doc?.dir
                                            .split(".")
                                            [doc?.dir.split(".").length - 1].toUpperCase() == "PNG" ||
                                        doc?.dir
                                            .split(".")
                                            [doc?.dir.split(".").length - 1].toUpperCase() ==
                                        "JPEG" ||
                                        doc?.dir
                                            .split(".")
                                            [doc?.dir.split(".").length - 1].toUpperCase() ==
                                        "JPG" ? (
                                            <img
                                                src={doc?.dir}
                                                alt="Foto importada"
                                                className={"w-full z-[10] absolute"}
                                            />
                                        ) : (
                                            <FileText className="w-[50%] h-[50%] absolute"/>
                                        )}
                                    </Button>
                                )}
                            </div>
                            <form
                                method="POST"
                                onSubmit={handleSubmit(enviarDoc)}
                                className=" w-[60%] h-full flex flex-col justify-start items-center gap-5"
                            >
                                <div className={cn("flex flex-col gap-4 w-full")}>
                                    <div className={cn("flex flex-col gap-4 w-full")}>
                                        <Label>Apelido</Label>
                                        <Input
                                            {...register("apelido")}
                                            id={"apelido"}
                                            name={"apelido"}
                                            type={"text"}
                                            placeholder={"Coloque um apelido neste documento:"}
                                            required
                                        />
                                    </div>
                                    <Label>Tipo de documento</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border !border-stone-600 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register("tipo")}
                                        id={"tipos"}
                                        name={"tipo"}
                                        required={true}
                                    >
                                        <option value="" selected disabled>
                                            Selecione
                                        </option>
                                        <option value="IDENTIDADE">Identidade</option>
                                        <option value="CPF">CPF</option>
                                        <option value="CNH">CNH</option>
                                        <option value="ASO">ASO</option>
                                        <option value="TITULOELEITOR">Título de eleitor</option>
                                        <option value="COMPROVANTERESIDENCIA">
                                            Comprovante de residencia
                                        </option>
                                        <option value="EXAMECOMPLEMENTAR">
                                            Exame complementar
                                        </option>
                                        <option value="DECLARACAO">Declaração</option>
                                        <option value="CONTRATO">Contrato</option>
                                        <option value="CERTIFICADO">Certificado</option>
                                        <option value="OUTROS">Outros</option>
                                    </select>
                                </div>
                                <div className={cn("flex flex-col gap-3 w-full")}>
                                    <Label>Tem vencimento?</Label>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            checked={requeredVencimento}
                                            onChange={() => setRequeredVencimento(true)}
                                            name="vencimento"
                                            id={"sim"}
                                            type={"radio"}
                                            className="w-5 h-5"
                                        />
                                        <Label className="" htmlFor={"sim"}>
                                            Sim
                                        </Label>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            checked={!requeredVencimento}
                                            onChange={() => setRequeredVencimento(false)}
                                            name="vencimento"
                                            id="nao"
                                            type={"radio"}
                                            className="w-5 h-5"
                                        />
                                        <Label className="" htmlFor={"nao"}>
                                            Não
                                        </Label>
                                    </div>
                                </div>

                                <div className={cn("flex flex-col gap-4 w-full")}>
                                    <Label>Data de emissão</Label>
                                    <Input
                                        {...register("dataEmissao")}
                                        id={"dataEmissao"}
                                        name={"dataEmissao"}
                                        type={"date"}
                                    />
                                </div>
                                {requeredVencimento && (
                                    <div className={cn("flex flex-col gap-4 w-full")}>
                                        <Label>Data de vencimento</Label>

                                        <Input
                                            {...register("dataVencimento")}
                                            id={"dataVencimento"}
                                            name={"dataVencimento"}
                                            type={"date"}
                                        />
                                    </div>
                                )}
                                <Button className={"w-full"}>Enviar</Button>
                            </form>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}

function ModalImportDocExistentes() {
    const state =
        stateModalImportDocExistenteRhGlobal<stateModalDocExistenteProps>(
            (state) => state,
        );
    const stateModalImport = stateModalImportDocRhGlobal((state) => state);
    const {host, configToken} = useContext(MainContext);
    const displayLounding = stateLoundingGlobal((state: any) => state);

    const substituirDoc = async () => {
        displayLounding.setDisplayLounding();

        const docs: SubstituirDocRhDTO = {
            docExistente: state.docExistente,
            docSubstituto: state.docReferent,
        };

        await axios
            .post(`${host}/rh/update/substituir/doc`, docs, configToken)
            .then(async (response) => {
                displayLounding.setDisplaySuccess(response.data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                state.alterState();
                stateModalImport.alterState();
                displayLounding.setDisplayReset();
                // refetchDocs()
                // refetchDocsAlert()
            })
            .catch(async () => {
                displayLounding.setDisplayFailure(
                    "Não foi possivel fazer a substituição no momento!",
                );
                await new Promise((resolve) => setTimeout(resolve, 1500));
                displayLounding.setDisplayReset();
            });
    };

    return (
        <>
            <Dialog open={state.stateModal} onOpenChange={state.alterState}>
                <DialogContent className="!max-w-[40rem] min-h-[20rem]">
                    <DialogHeader>
                        <DialogTitle>Atenção</DialogTitle>
                        <DialogDescription>
                            Já existe {state.tipo} vinculado a esté colaborador, deseja
                            substitui-lo?
                        </DialogDescription>
                        <div className="border rounded-xl p-5 w-full h-full flex flex-col gap-3">
                            <h3 className="text-base">Documento existente</h3>
                            <span className="text-xs text-stone-500">
                Você pode baixar o documento para visualizar!
              </span>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    Router.push(
                                        `${host}/rh/find/download/arquivo?name=${
                                            state.docExistente?.dir?.split("/")[4]
                                        }/${state.docExistente?.dir?.split("/")[5]}`,
                                        "",
                                        {
                                            scroll: true,
                                        },
                                    );
                                }}
                                className="border w-[50%] h-[70px] rounded-md flex justify-start gap-4"
                            >
                                <FileText className=""/>
                                <span>{state.docExistente?.apelido}</span>
                            </Button>
                            <div className="flex gap-2">
                                <Button onClick={substituirDoc} type="button">
                                    Substituir
                                </Button>
                                <Button onClick={state.alterState} variant="link" type="button">
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
