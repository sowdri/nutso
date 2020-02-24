import { NumberResult } from "../models/result/NumberResult";
import { NumberSchema } from "../models/schema/NumberSchema";
import { FieldPath } from "../models/FieldPath";
import { isNil, isNumber } from "../utils/typeChecker";

export const validateNumber = (o: any, schema: NumberSchema): NumberResult => {
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

  if (!isNumber(o)) {
    return {
      isValid: false,
      errorMessage: `Should be a number.`,
      errorPath: []
    };
  }

  const numbr = o as number;

  // min length
  if (!isNil(schema.min) && numbr < schema.min!) {
    return {
      isValid: false,
      errorMessage: `Should not be less than ${schema.min}.`,
      errorPath: []
    };
  }

  // max length
  if (!isNil(schema.max) && numbr > schema.max!) {
    return {
      isValid: false,
      errorMessage: `Should not be larger than ${schema.max}.`,
      errorPath: []
    };
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: []
  };
};
