import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BASE_PATH } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return "По запросу";
  }

  const amount = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0
  }).format(amount);
}

export function assetPath(path?: string | null) {
  if (!path) return `${BASE_PATH}/placeholder.svg`;
  if (path.startsWith("http")) return path;
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatProductType(value: "REBAR" | "PROFILE") {
  return value === "REBAR" ? "арматура" : "профиль";
}
