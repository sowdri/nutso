import { FieldPath } from "../FieldPath";

/**
 * Expolore the possibility of including all the errors at any given level.
 * Think, and redesign on white board and then do it again
 */

export type ValidationSuccess = {
  isValid: true;
};

export type ValidationFailure = {
  isValid: false;
  errorMessage: string;
  errorPath: FieldPath;
};

export type ValidationResult = ValidationSuccess | ValidationFailure;
