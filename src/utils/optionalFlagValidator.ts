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
export const optionalFlagValidator = <R>(root: R, flag?: OptionalFlag<R>): ValidationResult => {
  // flag not set, so it's required
  if (isNil(flag)) return INVALID;
  // flag is boolean
  if (typeof flag === "boolean") {
    // optional field
    if (flag === true) return VALID;
    // required field
    return INVALID;
  }
  // flag is a function
  const value = flag(root);
  // optional field
  if (value === true) return VALID;
  // required field
  return INVALID;
};
