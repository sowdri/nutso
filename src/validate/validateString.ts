import { StringResult } from "../models/result/StringResult";
import { StringSchema } from "../models/schema/StringSchema";
import { FieldPath } from "../models/FieldPath";
import { isNil, isString } from "../utils/typeChecker";

export const validateString = (o: any, schema: StringSchema): StringResult => {
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

  if (!isString(o)) {
    return {
      isValid: false,
      errorMessage: `Should be a string.`,
      errorPath: []
    };
  }

  const str = o as string;

  // min length
  if (!isNil(schema.minLength) && str.length < schema.minLength!) {
    return {
      isValid: false,
      errorMessage: `Should be at least ${schema.minLength} characters.`,
      errorPath: []
    };
  }

  // max length
  if (!isNil(schema.maxLength) && str.length > schema.maxLength!) {
    return {
      isValid: false,
      errorMessage: `Should not be longer than ${schema.maxLength} characters.`,
      errorPath: []
    };
  }

  // pattern
  if (!isNil(schema.regex)) {
    const match = schema.regex!.test(o);
    if (!match) {
      return {
        isValid: false,
        errorMessage: `Should match the pattern ${schema.regex} .`,
        errorPath: []
      };
    }
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: []
  };
};
