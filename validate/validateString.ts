import { StringResult } from "../result/StringResult";
import { StringSchema } from "../schema/StringSchema";
import { FieldPath } from "../models/FieldPath";
import { isNil, isString } from "../utils/is";

export const validateString = (o: any, schema: StringSchema, fieldPath: FieldPath): StringResult => {
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

  if (!isString(o)) {
    return {
      isValid: false,
      errorMessage: `Should be a string.`,
      fieldPath
    };
  }

  const str = o as string;

  // min length
  if (!isNil(schema.minLength) && str.length < schema.minLength!) {
    return {
      isValid: false,
      errorMessage: `Should be at least ${schema.minLength} characters.`,
      fieldPath
    };
  }

  // max length
  if (!isNil(schema.maxLength) && str.length > schema.maxLength!) {
    return {
      isValid: false,
      errorMessage: `Should not be longer than ${schema.maxLength} characters.`,
      fieldPath
    };
  }

  // pattern
  if (!isNil(schema.regex)) {
    const match = schema.regex!.test(o);
    if (!match) {
      return {
        isValid: false,
        errorMessage: `Should match the pattern ${schema.regex} .`,
        fieldPath
      };
    }
  }

  return {
    isValid: true,
    errorMessage: ``,
    fieldPath
  };
};
