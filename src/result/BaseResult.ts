import { FieldPath } from "../models/FieldPath";

export type BaseResult = {
  isValid: boolean;
  errorMessage: string;
  fieldPath: FieldPath;
};
