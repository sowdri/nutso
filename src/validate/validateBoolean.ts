import { BooleanResult } from "../models/result/BooleanResult";
import { BooleanSchema } from "../models/schema/BooleanSchema";
import { FieldPath } from "../models/FieldPath";
import { isBoolean, isNil } from "../utils/typeChecker";

export const validateBoolean = (o: any, schema: BooleanSchema, fieldPath: FieldPath): BooleanResult => {
  //

  // isnil
  if (isNil(o)) {
    if (!schema.optional) {
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
