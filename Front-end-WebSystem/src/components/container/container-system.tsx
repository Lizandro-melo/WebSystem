import {ReactNode} from "react";
import {cn} from "@/lib/utils";

export default function ContainerSystem({children, inputsClass}: { children: ReactNode, inputsClass?: string }) {
    return (
        <div className={cn("flex flex-col w-full h-full  rounded-r-md relative ", inputsClass)}>
            {children}
        </div>
    )
}