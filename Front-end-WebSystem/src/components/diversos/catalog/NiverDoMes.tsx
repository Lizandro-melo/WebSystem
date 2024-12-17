import { useQuery } from "react-query";
import { useContext, useEffect } from "react";
import { MainContext } from "@/provider/main-provider";
import axios from "axios";
import { NiverDoMesDTO } from "@/lib/models";
import { alterNomeCompletoParaNomeSobrenome } from "@/lib/utils";

export default function NiverDoMes() {
  const { host, configToken } = useContext(MainContext);

  const { data, refetch } = useQuery({
    queryKey: ["niverDoMes"],
    queryFn: async () => {
      return await axios
        .get(`${host}/find/system/niver`, configToken)
        .then((value) => {
          const aniver: NiverDoMesDTO[] = value.data;
          return aniver;
        });
    },
    enabled: !!configToken && !!host,
  });

  useEffect(() => {
    setTimeout(() => {
      if (configToken && host) {
        refetch();
      }
    }, 500);
  }, [configToken, host]);

  if (!data) {
    return <></>;
  }

  return (
    <div className="w-full border-2 dark:border-none shadow-lg bg-white dark:bg-gray-900 flex gap-5 mt-[75px] items-center flex-col justify-start p-3 rounded-xl relative">
      <div className="absolute  border-t -top-[70px] bg-white dark:bg-gray-900 z-10 overscroll-none  rounded-full p-5">
        <img
          src={"https://placehold.co/100x100"}
          className="w-[100px] h-[100px]"
          alt=""
        />
      </div>
      <div className="w-full  relative overflow-auto flex items-center flex-col justify-start">
        <img
          width={350}
          height={350}
          className=" dark:hidden z-[1] absolute -top-[85px]"
          src={"./assets/fogos1.gif"}
          alt=""
        />
        <img
          width={250}
          height={250}
          className=" dark:hidden max-sm:hidden z-[1] absolute right-5 bottom-[100px]"
          src={"./assets/fogos2.gif"}
          alt=""
        />
        <img
          width={250}
          height={250}
          className=" dark:hidden max-sm:hidden z-[1] absolute left-5 bottom-[100px]"
          src={"./assets/fogos2invert.gif"}
          alt=""
        />
        <div className="flex gap-10 mt-[70px] mb-[50px] z-40 items-center flex-col justify-start">
          <h2 className="text-2xl text-black dark:text-white">
            Aniversariantes do Mês
          </h2>
          <div className="w-full h-full flex justify-center gap-24 flex-wrap">
            {data
              .sort((a, b) => {
                const diaA = parseInt(a.dataNascimento?.split("-")[2]!);
                const diaB = parseInt(b.dataNascimento?.split("-")[2]!);

                return diaA - diaB;
              })
              .map((nivers) => {
                return (
                  <>
                    <div className="hover:animate-pulse flex items-center flex-col gap-2">
                      <img
                        className="w-[150px] h-[150px] rounded-xl"
                        src={nivers.img}
                        alt=""
                      />
                      <span className="text-black dark:text-white mt-2">
                        {alterNomeCompletoParaNomeSobrenome(nivers.nome)}
                      </span>
                      <span className="text-black dark:text-white">{`${
                        nivers.dataNascimento!.split("-")[2]
                      }/${nivers.dataNascimento!.split("-")[1]}`}</span>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
