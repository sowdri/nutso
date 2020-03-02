import { ValidationResult } from "../..";

export type ValidatorFn = <T>(value: T) => ValidationResult;
