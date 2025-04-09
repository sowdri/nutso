import { ValidationFailure, ValidationSuccess } from "./ValidationResult";

export type BooleanSuccessResult = ValidationSuccess;
export type BooleanFailureResult = ValidationFailure;
export type BooleanResult = BooleanSuccessResult | BooleanFailureResult;
