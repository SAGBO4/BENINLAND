import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFcfa(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount).replace("XOF", "FCFA");
}

export function maskIdentity(name: string): string {
  if (!name) return "";
  const parts = name.split(" ");
  return parts
    .map((p, idx) => {
      if (idx === 0) return p;
      if (p.length <= 2) return p[0] + "*";
      return p[0] + "*".repeat(p.length - 2) + p[p.length - 1];
    })
    .join(" ");
}

export function maskTelephone(tel: string): string {
  if (!tel || tel.length < 8) return tel;
  return tel.slice(0, 5) + "••••" + tel.slice(-2);
}
