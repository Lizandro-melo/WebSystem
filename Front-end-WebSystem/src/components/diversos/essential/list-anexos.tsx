import {FileText, Image, Plus, Sheet} from "lucide-react";
import React from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {cn} from "@/lib/utils";


type List = {
    list: any[],
    alterList: any
    height?: number
}
export default function ListAnexos({list, alterList, height}: List) {


    const addFile = (e: any) => {
        alterList((list: any) => {
            // @ts-ignore
            return [...list, e.target.files[0]]
        })
    }

    const removerFile = (i: number) => {
        alterList((list: any) => {
            return list.filter((_: any, index: number) => index !== i)
        })
    }

    return (
        <div
            className={cn("border h-[120px] w-full rounded-sm border-stone-300 p-2 overflow-x-auto overflow-y-hidden relative", height && `!h-[${height}px]`)}>

            <div className="h-full flex gap-2 absolute">
                {list.map((anexo, i) => {
                    const extencaoFile = anexo?.name.split(".")[anexo?.name.split(".").length - 1].toUpperCase()
                    return (
                        <ContextMenu key={i}>
                            <ContextMenuTrigger>
                                <span
                                    className="border border-stone-300 h-[80px] w-[80px] flex flex-col items-center justify-center flex-none rounded-md cursor-pointer hover:bg-slate-100">
                            {(extencaoFile === "CSV" || extencaoFile === "XLSX") && (
                                <Sheet className="w-5"/>
                            )}
                                    {(extencaoFile === "PNG" || extencaoFile === "JPEG" || extencaoFile === "JPG") && (
                                        <img className="w-5"/>
                                    )}
                                    {(extencaoFile === "TXT" || extencaoFile === "DOCX") && (
                                        <FileText className="w-5"/>
                                    )}
                                    <span>{extencaoFile}</span>
                                    </span>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={() => removerFile(i)}>Remover</ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>

                    )
                })}
                <Button
                    type="button"
                    variant="outline"
                    className="border border-stone-300 h-[80px] w-[80px] flex items-center justify-center flex-none rounded-md">
                    <Plus className="w-10 absolute z-[10]"/>
                    <Input type="file"
                           onChange={addFile}
                           className="text-white z-[20] cursor-pointer bg-transparent file:hidden w-full h-full border border-none"/>
                </Button>

            </div>


        </div>
    )
}