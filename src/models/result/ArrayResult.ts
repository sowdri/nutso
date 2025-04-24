import { Result } from "./Result";
import { ValidationFailure, ValidationSuccess } from "./ValidationResult";

export type ArraySuccessResult<E, T extends E[]> = ValidationSuccess & {
  items: Result<E>[];
};

export type ArrayFailureResult<E, T extends E[]> = ValidationFailure & {
  items: Result<E>[];
};

export type ArrayResult<E, T extends E[]> =
  | ArraySuccessResult<E, T>
  | ArrayFailureResult<E, T>;
