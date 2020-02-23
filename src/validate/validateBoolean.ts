import { BooleanResult } from "../models/result/BooleanResult";
import { BooleanSchema } from "../models/schema/BooleanSchema";
import { FieldPath } from "../models/FieldPath";
import { isBoolean, isNil } from "../utils/typeChecker";

export const validateBoolean = (o: any, schema: BooleanSchema): BooleanResult => {
  //

  // isnil
  if (isNil(o)) {
    if (!schema.optional) {
      return {
        isValid: false,
        errorMessage: `Required field.`,
        errorPath: []
      };
    }
    return {
      isValid: true,
      errorMessage: "",
      errorPath: []
    };
  }

  if (!isBoolean(o)) {
    return {
      isValid: false,
      errorMessage: `Should be true or false.`,
      errorPath: []
    };
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: []
  };
};
