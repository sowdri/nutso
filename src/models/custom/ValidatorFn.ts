import { Result } from "../result/Result";
import { FieldPath } from "../FieldPath";
import { ValidationResult } from "../result/ValidationResult";

export type ValidatorFnResult = Pick<ValidationResult, "isValid" | "errorMessage">;

export type ValidatorFn<T, R> = (field: T, root: R) => ValidatorFnResult;
