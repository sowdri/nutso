import { ValidationFailure, ValidationResult } from "..";
import { ValidationFn } from "../models/ValidationFn";

export const validationFnExecutor = <T>(args: {
  value: T;
  root: unknown;
  parent?: unknown;
  validationFn: ValidationFn<T>;
  path: string[];
}): ValidationResult | undefined => {
  try {
    const result = args.validationFn(args);
    if (result) {
      return {
        ...result, // created by user, so put that first, such that `isValid` and `errorPath` are not overwritten
        isValid: false,
        errorPath: args.path,
      };
    }
  } catch (e) {
    // if (Object.keys(e as any).includes("message")) {
    if (e instanceof Error) {
      return {
        errorMessage: e.message,
        isValid: false,
        errorPath: args.path,
      };
    }
    if (Object.keys(e as any).includes("message")) {
      return {
        errorMessage: (e as any).message,
        isValid: false,
        errorPath: args.path,
      };
    }
    console.error(`Exception executing executor function`, e);
    return {
      errorMessage: `Exception in validationFn`,
      isValid: false,
      errorPath: args.path,
    };
  }
};
