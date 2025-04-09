import { Result } from "./Result";
import { ValidationFailure, ValidationSuccess } from "./ValidationResult";

export type ArraySuccessResult<T> = ValidationSuccess & {
  items: Result<T>[];
};

export type ArrayFailureResult<T> = ValidationFailure & {
  items: Result<T>[];
};

export type ArrayResult<T> = ArraySuccessResult<T> | ArrayFailureResult<T>;
