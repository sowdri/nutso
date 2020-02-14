import { Result } from "./Result";
import { ValidationResult } from "./BaseResult";

export type ArrayResult<T> = ValidationResult & {
  items: Result<T>[];
};
