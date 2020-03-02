import { FieldPath } from "../FieldPath";

/**
 * Expolore the possibility of including all the errors at any given level.
 * Think, and redesign on white board and then do it again
 */
export type ValidationResult = {
  isValid: boolean;
  errorMessage: string;
  errorPath: FieldPath;
};
