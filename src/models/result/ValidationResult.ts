import { FieldPath } from "../FieldPath";

/**
 * TODO remodel this to include the path that triggered the error message
 * For any given object, the error could have occured deep in the tree
 * So along with the error message, we should have a path that points to what triggered that particular error
 *
 * Expolore the possibility of including all the errors at any given level.
 * Think, and redesign on white board and then do it again
 */
export type ValidationResult = {
  isValid: boolean;
  errorMessage: string;
  errorPath: FieldPath;
};
