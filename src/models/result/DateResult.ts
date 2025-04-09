import { ValidationFailure, ValidationSuccess } from "./ValidationResult";

export type DateSuccessResult = ValidationSuccess;
export type DateFailureResult = ValidationFailure;
export type DateResult = DateSuccessResult | DateFailureResult;
