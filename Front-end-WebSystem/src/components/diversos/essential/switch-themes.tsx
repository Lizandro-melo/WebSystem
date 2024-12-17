import { Switch } from "@/components/ui/switch";
import { MainContext } from "@/provider/main-provider";import { cn } from "@/lib/utils";
import { parseCookies, setCookie } from "nookies";
import { useCallback, useContext, useEffect, useState } from "react";

// Componente responsável
export default function SwitchThemes({
  inputsClass,
  textClass,
}: {
  inputsClass?: string;
  textClass?: string;
}) {
  const { themes, setThemes } = useContext(MainContext);

  const alterThemes = useCallback(() => {
    const { "themes-quality": themes } = parseCookies();
    if (themes === "dark") {
      setThemes(false);
      setCookie(undefined, "themes-quality", "white", {
        maxAge: 60 * 60 * 24 * 30,
      });
      document.documentElement.classList.remove("dark");
    } else {
      setThemes(true);
      setCookie(undefined, "themes-quality", "dark", {
        maxAge: 60 * 60 * 24 * 30,
      });
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className={cn("flex gap-2 items-center", inputsClass!)}>
      <span
        className={cn(
          "font-medium text-sm text-white",
          textClass,
        )}
      >
        Tema noturno
      </span>
      <Switch checked={themes} onCheckedChange={() => alterThemes()}></Switch>
    </div>
  );
}
