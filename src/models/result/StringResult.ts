import { ValidationFailure, ValidationSuccess } from "./ValidationResult";

export type StringSuccessResult = ValidationSuccess;
export type StringFailureResult = ValidationFailure;
export type StringResult = StringSuccessResult | StringFailureResult;
