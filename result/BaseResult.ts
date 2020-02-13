import { FieldPath } from "../utils/FieldPath";

export type BaseResult = {
  isValid: boolean;
  errorMessage: string;
  fieldPath: FieldPath;
};
