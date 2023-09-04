import { NumberResult } from "../models/result/NumberResult";
import { NumberSchema } from "../models/schema/NumberSchema";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";
import { isNil, isNumber } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";

export const validateNumber = <R, P>(args: {
  value: any;
  root: R;
  parent: P;
  schema: NumberSchema<R, P>;
}): NumberResult => {
  //
  const { value, schema } = args;
  // isnil
  if (isNil(value)) {
    return optionalFlagValidator({ ...args, flag: schema.optional });
  }

  if (!isNumber(value) || isNaN(value)) {
    return {
      isValid: false,
      errorMessage: `Should be a number.`,
      errorPath: [],
    };
  }

  const numbr = value as number;

  // min length
  if (!isNil(schema.min) && numbr < schema.min!) {
    return {
      isValid: false,
      errorMessage: `Should not be less than ${schema.min}.`,
      errorPath: [],
    };
  }

  // max length
  if (!isNil(schema.max) && numbr > schema.max!) {
    return {
      isValid: false,
      errorMessage: `Should not be larger than ${schema.max}.`,
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
    const result = validationFnExecutor({ ...args, value: numbr, validationFn: schema.validationFn });
    if (result) return result;
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: [],
  };
};
