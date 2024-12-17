import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {stateAlertDialogGlobal, stateAlertDialogGlobalProps, stateModalHistoricoTicketGlobal} from "@/lib/globalStates";

export default function DialogAlertGlobal() {
    const state = stateAlertDialogGlobal<stateAlertDialogGlobalProps>((state) => state)

    return (
        <AlertDialog open={state.state} onOpenChange={state.setState}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{state.titulo}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {state.mensagem}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={state.action}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}