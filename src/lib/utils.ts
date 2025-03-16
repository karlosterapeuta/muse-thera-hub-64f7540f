
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatCurrencyInput(value: string): string {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, "");
  
  // Convert to a number (integer representing cents)
  const cents = parseInt(numericValue, 10) || 0;
  
  // Format the value as currency
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
  
  return formattedValue;
}

export function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, "");
  
  // Convert to a number (floating point representing reais)
  const reais = parseInt(numericValue, 10) || 0;
  
  return reais / 100;
}
