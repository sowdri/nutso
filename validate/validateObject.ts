import { NumberResult } from "../result/NumberResult";
import { NumberSchema } from "../schema/NumberSchema";
import { FieldPath, fieldPathStr } from "../utils/FieldPath";
import { isNil, isString, isNumber } from "../utils/is";

export const validateNumber = (o: any, schema: NumberSchema, fieldPath: FieldPath): NumberResult => {
  //
  const path = fieldPathStr(fieldPath);

  // isnil
  if (isNil(o)) {
    if (schema.required) {
      return {
        isValid: false,
        errorMessage: `${path} is required.`
      };
    }
    return {
      isValid: true,
      errorMessage: ""
    };
  }

  if (!isNumber(o)) {
    return {
      isValid: false,
      errorMessage: `${path} should be a number.`
    };
  }

  const numbr = o as number;

  // min length
  if (!isNil(schema.min) && numbr < schema.min) {
    return {
      isValid: false,
      errorMessage: `${path} should not be less than ${schema.min}.`
    };
  }

  // max length
  if (!isNil(schema.max) && numbr > schema.max) {
    return {
      isValid: false,
      errorMessage: `${path} should not be larger than ${schema.max}.`
    };
  }

  return {
    isValid: true,
    errorMessage: ``
  };
};
