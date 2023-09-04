import { OptionalFlag } from "../models/OptionalFlag";
import { ValidationResult } from "../models/result/ValidationResult";
import { isNil } from "./typeChecker";

const INVALID: ValidationResult = {
  isValid: false,
  errorMessage: `Required field.`,
  errorPath: [],
};

const VALID: ValidationResult = {
  isValid: true,
  errorMessage: ``,
  errorPath: [],
};

// this has to be called only when the value is empty
export const optionalFlagValidator = <R, P>(args: {
  root: R;
  parent?: P;
  flag?: OptionalFlag<R, P>;
}): ValidationResult => {
  const optional = isOptional(args);
  if (optional) return VALID;
  return INVALID;
};

export const isOptional = <R, P>(args: { root: R; parent?: P; flag?: OptionalFlag<R, P> }): boolean => {
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
