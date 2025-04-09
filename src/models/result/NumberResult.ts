import { ValidationFailure, ValidationSuccess } from "./ValidationResult";

export type NumberSuccessResult = ValidationSuccess;
export type NumberFailureResult = ValidationFailure;
export type NumberResult = NumberSuccessResult | NumberFailureResult;
