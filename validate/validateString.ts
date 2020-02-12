import { StringSchema } from "../schema/StringSchema";
import { StringResult } from "../result/StringResult";
import { isNil, isString } from "../utils/is";
import { FieldPath, fieldPathStr } from "../utils/FieldPath";

export const validateString = (o: any, schema: StringSchema, fieldPath: FieldPath): StringResult => {
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

  if (!isString(o)) {
    return {
      isValid: false,
      errorMessage: `${path} should be a string.`
    };
  }

  const str = o as string;

  // min length
  if (!isNil(schema.minLength) && str.length < schema.minLength!) {
    return {
      isValid: false,
      errorMessage: `${path} should be at least ${schema.minLength} characters.`
    };
  }

  // max length
  if (!isNil(schema.maxLength) && str.length > schema.maxLength!) {
    return {
      isValid: false,
      errorMessage: `${path} should not be longer than ${schema.maxLength} characters.`
    };
  }

  // pattern
  if (!isNil(schema.regex)) {
    const match = schema.regex!.test(o);
    if (!match) {
      return {
        isValid: false,
        errorMessage: `${path} should match the pattern ${schema.regex} .`
      };
    }
  }

  return {
    isValid: true,
    errorMessage: ``
  };
};
