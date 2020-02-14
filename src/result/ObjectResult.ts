import { Result } from "./Result";
import { ValidationResult } from "./BaseResult";

export type ObjectResult<T> = ValidationResult & {
  properties: {
    [P in keyof T]: Result<T[P]>;
  };
};
