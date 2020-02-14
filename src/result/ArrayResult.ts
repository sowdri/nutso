import { Result } from "./Result";
import { ValidationResult } from "./ValidationResult";

export type ArrayResult<T> = ValidationResult & {
  items: Result<T>[];
};
