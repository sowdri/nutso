import { Result } from "./Result";
import { ValidationResult } from "./ValidationResult";

export type ObjectResult<T> = ValidationResult & {
  properties: {
    [P in keyof T]: Result<T[P]>;
  };
};
