import { BooleanResult } from "../result/BooleanResult";
import { BooleanSchema } from "../schema/BooleanSchema";
import { FieldPath } from "../models/FieldPath";
import { isBoolean, isNil } from "../utils/typeChecker";

export const validateBoolean = (o: any, schema: BooleanSchema, fieldPath: FieldPath): BooleanResult => {
  //

  // isnil
  if (isNil(o)) {
    if (schema.required) {
      return {
        isValid: false,
        errorMessage: `Required field.`,
        fieldPath
      };
    }
    return {
      isValid: true,
      errorMessage: "",
      fieldPath
    };
  }

  if (!isBoolean(o)) {
    return {
      isValid: false,
      errorMessage: `Should be true or false.`,
      fieldPath
    };
  }

  return {
    isValid: true,
    errorMessage: ``,
    fieldPath
  };
};
