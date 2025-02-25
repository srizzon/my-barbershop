import { InjectionToken } from '@angular/core';

export interface ErrorMessages {
  [key: string]: (params: unknown) => string;
}

export const DEFAULT_ERRORS = {
  required: () => `Campo obrigatório`,
  email: () => `E-mail inválido`,
  minlength: ({ requiredLength }: { requiredLength: number }) => `Mínimo de ${requiredLength} caracteres`,
  maxlength: ({ requiredLength }: { requiredLength: number }) => `Máximo de ${requiredLength} caracteres`,
  min: ({ min }: { min: number }) => `Valor mínimo: ${min}`,
  max: ({ max }: { max: number }) => `Valor máximo: ${max}`,
  mask: () => `Valor inválido`,
  passwordNotMatch: () => `As senhas não coincidem`,
  fullName: () => `Sobrenome obrigatório`,
  invalidDate: () => `Data inválida`,
};

export const ERROR_MESSAGES = new InjectionToken('ERROR_MESSAGES', {
  providedIn: 'root',
  factory: () => DEFAULT_ERRORS,
});
