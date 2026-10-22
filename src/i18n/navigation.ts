import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappers tipados de la navegación de Next que respetan el prefijo de idioma.
// Usar siempre estos en lugar de next/link y next/navigation.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
