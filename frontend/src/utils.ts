import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function devMsg(input: string) {
  if(import.meta.env.DEV) console.log("%cDEV %c" + input, "color: lightblue; font-weight: bold;", "color: white; font-weight: normal;")
}