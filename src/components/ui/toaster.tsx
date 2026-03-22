import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "hsl(210 45% 22%)",
          color: "hsl(210 20% 92%)",
          border: "1px solid hsl(210 30% 30%)",
        },
      }}
    />
  );
}
