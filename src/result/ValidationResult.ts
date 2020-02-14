import { FieldPath } from "../models/FieldPath";

export type ValidationResult = {
  isValid: boolean;
  errorMessage: string;
  fieldPath: FieldPath;
};
