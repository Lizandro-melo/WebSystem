import { alterNomeCompletoParaNomeSobrenome, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, Undo } from "lucide-react";
import { ReactNode, useContext, useState } from "react";
import { classStyleNavBarIcons, stateNavBarGlobal } from "@/lib/globalStates";
import Router from "next/router";
import { MainContext } from "@/provider/main-provider";


export const NavBar = {
  Root: NavBarRoot,
  Section: NavBarSection,
  Item: NavBarItem,
  ButtonBack: NavBarButtonBack,
};

type NavBarRootProps = {
  children: ReactNode;
  buttonBack: boolean;
};

function NavBarRoot({ children, buttonBack }: NavBarRootProps) {
  const state = stateNavBarGlobal((state: any) => state);
  const { user } = useContext(MainContext);

  return (
    <div
      onMouseOver={() => {
        if (!state.stateNavBar) {
          state.setBool(true);
        }
      }}
      className={cn(
        "w-full relative scrowInvivel h-full bg-[var(--color-pri)] overflow-auto flex flex-col items-center ",
      )}
    >
      <div
        className={cn(
          "bg-[var(--color-pri)]  border-none rounded-none sticky z-50 top-0 w-full h-[35px] border flex items-center justify-between  py-10 cursor-pointer ",
          !state.stateNavBar && "!justify-center",
        )}
      >
        <button className="bg-[var(--color-pri)] px-10 hover:bg-[var(--color-pri-hover)] py-2 flex gap-5 absolute w-full items-center">
          {user?.dirFoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`.${user?.dirFoto}`}
              width={40}
              height={40}
              className={cn(
                "rounded-full w-10",
                !state.stateNavBar && "absolute z-30",
              )}
              alt="Foto de perfil"
            />
          )}
          <span
            className={cn(
              "text-white dark:text-white text-xs w-[100px] text-nowrap",
              !state.stateNavBar &&
                "w-0 opacity-0 duration-500 overflow-hidden absolute",
            )}
          >
            {alterNomeCompletoParaNomeSobrenome(user?.nomeCompleto)}
          </span>
        </button>
      </div>
      {children}
      {buttonBack && (
        <div
          className={cn(
            "bg-[var(--color-pri)] border-none rounded-none sticky z-50 bottom-0 w-full h-[35px] border flex items-center justify-between  py-10 cursor-pointer ",
            !state.stateNavBar && "!justify-center",
          )}
        >
          <NavBarButtonBack />
        </div>
      )}
    </div>
  );
}

type NavBarSectionProps = {
  title: string;
  testeRole: boolean | undefined;
  icon?: ReactNode;
  itens?: ReactNode[];
};

function NavBarSection({ title, testeRole, icon, itens }: NavBarSectionProps) {
  const state = stateNavBarGlobal((state: any) => state);
  const [stateItem, setStateItem] = useState(true);

  if (testeRole) {
    return (
      <div
        className={cn(
          "w-[85%] relative flex flex-col bg-[var(--color-pri)] justify-center items-center ",
        )}
      >
        <div
          onClick={() => setStateItem(!stateItem)}
          className={cn(
            "bg-[var(--color-pri)] z-30 dark:hover:bg-gray-900 rounded-xl gap-7 px-5 border-none border w-full hover:bg-[var(--color-pri-hover)] text-white flex items-center justify-between cursor-pointer relative py-3",
            !state.stateNavBar && "justify-center h-11",
          )}
        >
          <div
            className={cn(
              "flex gap-5 items-center",
              !state.stateNavBar && "absolute",
            )}
          >
            {icon}
            <span
              className={cn(
                "text-xs w-[100px] whitespace-nowrap",
                !state.stateNavBar &&
                  "w-0 opacity-0 duration-500 overflow-hidden absolute",
              )}
            >
              {title}
            </span>
          </div>
          <div
            className={cn(
              !state.stateNavBar &&
                "w-0 opacity-0 duration-500 overflow-hidden absolute",
            )}
          >
            <ChevronRight
              className={cn(
                "w-4 h-4",
                !state.stateNavBar &&
                  "w-0 opacity-0 duration-500 overflow-hidden absolute",
                !stateItem && "rotate-90",
              )}
            />
          </div>
        </div>
        {state.stateNavBar && (
          <ul
            className={cn(
              "top-0 relative border-l pl-3 gap-3 w-[79%] flex py-2 flex-col h-full",
              stateItem && "-top-full opacity-0 h-full absolute -z-20",
            )}
          >
            {itens?.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
        )}
      </div>
    );
  }
  return null;
}

type NavBarItemProps = {
  title: string;
  action?: () => void;
  testeRole: boolean | undefined;
};

function NavBarItem({ title, action, testeRole }: NavBarItemProps) {
  const state = stateNavBarGlobal((state: any) => state);

  if (testeRole) {
    return (
      <Button
        title={title}
        onClick={action}
        className={cn(
          "bg-[var(--color-pri)] hover:bg-[var(--color-pri-hover)] border-none w-full py-4 border flex items-center justify-between rounded-xl",
          !state.stateNavBar && "!justify-center",
        )}
      >
        <span
          className={cn(
            "font-semibold text-xs text-white whitespace-nowrap w-[100px] text-start",
            !state.stateNavBar && "w-0 opacity-0 duration-500",
          )}
        >
          {title}
        </span>
      </Button>
    );
  }
  return null;
}

function NavBarButtonBack() {
  const state = stateNavBarGlobal((state: any) => state);

  return (
    <Button
      onClick={() => Router.push("/home")}
      className={cn(
        "bg-[var(--color-pri)] px-10 hover:bg-[var(--color-pri-hover)] py-2 flex gap-5 absolute w-full items-center",
        !state.stateNavBar && "!justify-center",
      )}
    >
      {state.stateNavBar && (
        <span
          className={cn(
            "font-semibold text-xs text-white whitespace-nowrap w-[100px] text-start",
            !state.stateNavBar && "w-0 opacity-0 duration-500",
          )}
        >
          Voltar
        </span>
      )}
      <Undo className={classStyleNavBarIcons} />
    </Button>
  );
}
