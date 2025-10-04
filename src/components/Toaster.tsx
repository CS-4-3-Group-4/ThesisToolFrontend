import { useTheme } from "next-themes";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      richColors
      className="flex justify-center"
      // closeButton
      theme={theme as ToasterProps["theme"]}
      style={{ fontFamily: "inherit" }}
    />
  );
}
