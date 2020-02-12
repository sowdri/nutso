import { NumberResult } from "../result/NumberResult";
import { NumberSchema } from "../schema/NumberSchema";
import { FieldPath, fieldPathStr } from "../utils/FieldPath";
import { isNil, isString, isNumber, isBoolean } from "../utils/is";
import { BooleanSchema } from "../schema/BooleanSchema";
import { BooleanResult } from "../result/BooleanResult";

export const validateBoolean = (o: any, schema: BooleanSchema, fieldPath: FieldPath): BooleanResult => {
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

  if (!isBoolean(o)) {
    return {
      isValid: false,
      errorMessage: `${path} should be true or false.`
    };
  }

  return {
    isValid: true,
    errorMessage: ``
  };
};
