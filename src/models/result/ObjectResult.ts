import { Result } from "./Result";
import { ValidationResult } from "./ValidationResult";

export type ObjectResult<T extends { [key: string]: any }> = ValidationResult & {
  properties: {
    [P in keyof T]: Result<T[P]>;
  };
};
