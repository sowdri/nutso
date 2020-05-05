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
export const optionalFlagValidator = <P>(args: { parent: P; flag?: OptionalFlag<P> }): ValidationResult => {
  // flag not set, so it's required
  if (isNil(args.flag)) return INVALID;
  // flag is boolean
  if (typeof args.flag === "boolean") {
    // optional field
    if (args.flag === true) return VALID;
    // required field
    return INVALID;
  }
  // flag is a function
  const value = args.flag(args.parent);
  // optional field
  if (value === true) return VALID;
  // required field
  return INVALID;
};
