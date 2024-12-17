import { ReactNode } from "react";

// Container raiz, which full screen, height full screen
export default function ContainerRoot({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen">
      {children}
    </div>
  );
}
