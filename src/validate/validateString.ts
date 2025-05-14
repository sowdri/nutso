import { StringResult } from "../models/result/StringResult";
import { StringSchema } from "../models/schema/StringSchema";
import { isNil, isString } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";
import {
  optionalFlagValidator,
  isOptional,
} from "../utils/optionalFlagValidator";

export const validateString = (args: {
  value: any;
  root: unknown;
  parent?: unknown;
  schema: StringSchema;
  path: string[];
}): StringResult => {
  const { value, schema, root, parent, path } = args;
  //

  // Check if field is applicable
  if (
    schema.isApplicableFn &&
    !schema.isApplicableFn({ value, parent, root })
  ) {
    return {
      isValid: true,
    };
  }

  // isnil
  if (isNil(value)) {
    const validationResult = optionalFlagValidator({
      ...args,
      flag: schema.optional,
    });

    if (validationResult.isValid) {
      return {
        isValid: true,
      };
    } else {
      return {
        isValid: false,
        errorMessage: validationResult.errorMessage,
        errorPath: validationResult.errorPath,
      };
    }
  }

  // check if type is string
  if (!isString(value)) {
    return {
      isValid: false,
      errorMessage: `Should be a string.`,
      errorPath: path,
    };
  }

  const str = value as string;

  // check if empty
  if (str === "") {
    // we are not handling empty strings as a special case
    // if the user does not want to allow empty strings, they can use minLength or pattern to achieve that
  }

  // Exact value check - takes precedence over other validations
  if (!isNil(schema.value)) {
    if (str !== schema.value) {
      return {
        isValid: false,
        errorMessage: `Should be exactly: "${schema.value}"`,
        errorPath: path,
      };
    }
    // If exact value matches, skip other validations like minLength, maxLength, etc.
    return {
      isValid: true,
    };
  }

  // min length
  if (!isNil(schema.minLength) && str.length < schema.minLength!) {
    return {
      isValid: false,
      errorMessage: `Should be at least ${schema.minLength} characters.`,
      errorPath: path,
    };
  }

  // max length
  if (!isNil(schema.maxLength) && str.length > schema.maxLength!) {
    return {
      isValid: false,
      errorMessage: `Should not be longer than ${schema.maxLength} characters.`,
      errorPath: path,
    };
  }

  // pattern
  if (!isNil(schema.pattern)) {
    const match = schema.pattern!.test(value);
    if (!match) {
      return {
        isValid: false,
        errorMessage: `Should match the pattern ${schema.pattern} .`,
        errorPath: path,
      };
    }
  }

  // values
  if (!isNil(schema.values) && schema.values!.length > 0) {
    if (!schema.values!.includes(str)) {
      return {
        isValid: false,
        errorMessage: `Should be one of: ${schema.values!.join(", ")}.`,
        errorPath: path,
      };
    }
  }

  // validationFn
  if (schema.validationFn) {
    const result = validationFnExecutor({
      ...args,
      value,
      validationFn: schema.validationFn,
    });
    if (result) return result;
  }

  return {
    isValid: true,
  };
};
