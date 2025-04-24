import { NumberResult } from "../models/result/NumberResult";
import { NumberSchema } from "../models/schema/NumberSchema";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";
import { isNil, isNumber } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";

export const validateNumber = (args: {
  value: any;
  root: unknown;
  parent?: unknown;
  schema: NumberSchema;
  path: string[];
}): NumberResult => {
  //
  const { value, schema, root, parent, path } = args;

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

  if (!isNumber(value) || isNaN(value)) {
    return {
      isValid: false,
      errorMessage: `Should be a number.`,
      errorPath: path,
    };
  }

  const numbr = value as number;

  // min length
  if (!isNil(schema.min) && numbr < schema.min!) {
    return {
      isValid: false,
      errorMessage: `Should not be less than ${schema.min}.`,
      errorPath: path,
    };
  }

  // max length
  if (!isNil(schema.max) && numbr > schema.max!) {
    return {
      isValid: false,
      errorMessage: `Should not be larger than ${schema.max}.`,
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
