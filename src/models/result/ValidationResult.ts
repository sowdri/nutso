import { FieldPath } from "../FieldPath";

export type ValidationResult = {
  isValid: boolean;
  errorMessage: string;
  fieldPath: FieldPath;
};
