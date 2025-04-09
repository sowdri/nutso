import { Result } from "./Result";
import { ValidationFailure, ValidationSuccess } from "./ValidationResult";

export type ObjectSuccessResult<T> = ValidationSuccess & {
  properties: {
    [P in keyof T]: Result<T[P]>;
  };
};

export type ObjectFailureResult<T> = ValidationFailure & {
  properties: {
    [P in keyof T]: Result<T[P]>;
  };
};

export type ObjectResult<T> = ObjectSuccessResult<T> | ObjectFailureResult<T>;
