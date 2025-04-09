import { ValidationFailure, ValidationSuccess } from "./ValidationResult";

export type TupleSuccessResult<T> = ValidationSuccess;
export type TupleFailureResult<T> = ValidationFailure;
export type TupleSchema<T> = TupleSuccessResult<T> | TupleFailureResult<T>;
