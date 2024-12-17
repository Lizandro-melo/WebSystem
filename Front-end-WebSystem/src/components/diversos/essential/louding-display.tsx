import { stateLoundingGlobal } from "@/lib/globalStates";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleDotDashed, CircleX } from "lucide-react";

export default function LoudingDisplay() {
  const lounding = stateLoundingGlobal(
    (state: any) => state.stateDisplayLounding,
  );
  const success = stateLoundingGlobal(
    (state: any) => state.stateDisplaySuccess,
  );
  const failure = stateLoundingGlobal(
    (state: any) => state.stateDisplayFailure,
  );
  const mensagem = stateLoundingGlobal((state: any) => state.mensagem);

  return (
    <>
      {(lounding || success || failure) && (
        <div
          className={cn(
            "z-[100] absolute w-screen h-screen grid place-content-center  transition-all",
          )}
        >
          <div
            className={cn(
              "bg-white dark:bg-black absolute opacity-40 z-10 w-screen h-screen ",
            )}
          ></div>
          {lounding && (
            <div className="w-full flex flex-col gap-5 items-center z-20">
              <CircleDotDashed
                className={cn("w-[80px] h-[80px] animate-spin")}
              />
              <span className="text-center font-bold text-stone-800  z-20">
                Executando...
              </span>
            </div>
          )}
          {success && (
            <div className="w-full flex flex-col gap-5 items-center z-20">
              <CircleCheck
                className={cn("w-[80px] h-[80px] stroke-green-700 z-[100]")}
              />
              <span className="text-center font-bold dark:text-white text-stone-800  z-20">
                {mensagem}
              </span>
            </div>
          )}

          {failure && (
            <div className="w-full flex flex-col gap-5 items-center z-20">
              <CircleX
                className={cn("w-[80px] h-[80px] stroke-red-700 z-[100]")}
              />
              <span className="text-center font-bold dark:text-white text-stone-800  z-20">
                {mensagem}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
