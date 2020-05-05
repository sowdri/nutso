import { StringResult } from "../models/result/StringResult";
import { StringSchema } from "../models/schema/StringSchema";
import { isNil, isString } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";

export const validateString = <P>(args: { value: any; parent: P; schema: StringSchema<P> }): StringResult => {
  const { value, parent, schema } = args;
  //

  // isnil
  if (isNil(value)) {
    return optionalFlagValidator({ parent, flag: schema.optional });
  }

  // check if type is string
  if (!isString(value)) {
    return {
      isValid: false,
      errorMessage: `Should be a string.`,
      errorPath: [],
    };
  }

  const str = value as string;

  // check if empty
  if (str === "" && !schema.optional) {
    return {
      isValid: false,
      errorMessage: `Should not be empty.`,
      errorPath: [],
    };
  }

  // min length
  if (!isNil(schema.minLength) && str.length < schema.minLength!) {
    return {
      isValid: false,
      errorMessage: `Should be at least ${schema.minLength} characters.`,
      errorPath: [],
    };
  }

  // max length
  if (!isNil(schema.maxLength) && str.length > schema.maxLength!) {
    return {
      isValid: false,
      errorMessage: `Should not be longer than ${schema.maxLength} characters.`,
      errorPath: [],
    };
  }

  // pattern
  if (!isNil(schema.pattern)) {
    const match = schema.pattern!.test(value);
    if (!match) {
      return {
        isValid: false,
        errorMessage: `Should match the pattern ${schema.pattern} .`,
        errorPath: [],
      };
    }
  }

  // validationFn
  if (schema.validationFn) {
    const result = validationFnExecutor({ value: str, validationFn: schema.validationFn, parent: parent });
    if (result) return result;
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: [],
  };
};
