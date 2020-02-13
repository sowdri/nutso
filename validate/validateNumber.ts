import { NumberResult } from "../result/NumberResult";
import { NumberSchema } from "../schema/NumberSchema";
import { FieldPath } from "../models/FieldPath";
import { isNil, isNumber } from "../utils/is";

export const validateNumber = (o: any, schema: NumberSchema, fieldPath: FieldPath): NumberResult => {
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

  if (!isNumber(o)) {
    return {
      isValid: false,
      errorMessage: `Should be a number.`,
      fieldPath
    };
  }

  const numbr = o as number;

  // min length
  if (!isNil(schema.min) && numbr < schema.min) {
    return {
      isValid: false,
      errorMessage: `Should not be less than ${schema.min}.`,
      fieldPath
    };
  }

  // max length
  if (!isNil(schema.max) && numbr > schema.max) {
    return {
      isValid: false,
      errorMessage: `Should not be larger than ${schema.max}.`,
      fieldPath
    };
  }

  return {
    isValid: true,
    errorMessage: ``,
    fieldPath
  };
};
