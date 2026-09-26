import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFcfa(amount: number): string {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return "0 FCFA";
  }
  const formattedNumber = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formattedNumber} FCFA`;
}

export function maskIdentity(name: string): string {
  if (!name || typeof name !== "string") return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  return parts
    .map((p, idx) => {
      if (idx === 0) return p;
      if (p.length <= 2) return p[0] + "*";
      return p[0] + "*".repeat(p.length - 2) + p[p.length - 1];
    })
    .join(" ");
}

export function maskTelephone(tel: string): string {
  if (!tel || typeof tel !== "string") return "";
  if (tel.length < 8) return tel;
  return tel.slice(0, 5) + "••••" + tel.slice(-2);
}
