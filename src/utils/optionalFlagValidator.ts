import { OptionalFlag } from "../models/OptionalFlag";
import {
  ValidationFailure,
  ValidationResult,
  ValidationSuccess,
} from "../models/result/ValidationResult";
import { isNil } from "./typeChecker";

// Define the result bases
const INVALID_BASE: Omit<ValidationFailure, "errorPath"> = {
  isValid: false,
  errorMessage: `Required field.`,
};

const VALID_BASE: ValidationSuccess = {
  isValid: true,
};

// this has to be called only when the value is empty
export const optionalFlagValidator = <R, P>(args: {
  root: R;
  parent?: P;
  flag?: OptionalFlag<R, P>;
  path: string[];
}): ValidationResult => {
  const optional = isOptional(args);
  if (optional) return VALID_BASE;
  return { ...INVALID_BASE, errorPath: args.path };
};

export const isOptional = <R, P>(args: {
  root: R;
  parent?: P;
  flag?: OptionalFlag<R, P>;
  path?: string[];
}): boolean => {
  // flag not set, so the field is not optional
  if (isNil(args.flag)) return false;
  // flag is boolean, return flag
  if (typeof args.flag === "boolean") {
    return args.flag;
  }
  // flag is a function
  const value = args.flag(args);
  return value;
};
