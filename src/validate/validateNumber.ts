import { NumberResult } from "../models/result/NumberResult";
import { NumberSchema } from "../models/schema/NumberSchema";
import { FieldPath } from "../models/FieldPath";
import { isNil, isNumber } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";

export const validateNumber = <R>(o: any, root: R, schema: NumberSchema<R>): NumberResult => {
  //

  // isnil
  if (isNil(o)) {
    return optionalFlagValidator(root, schema.optional);
  }

  if (!isNumber(o)) {
    return {
      isValid: false,
      errorMessage: `Should be a number.`,
      errorPath: [],
    };
  }

  const numbr = o as number;

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
    const match = schema.pattern!.test(o);
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
    const result = validationFnExecutor({ value: numbr, validationFn: schema.validationFn, root });
    if (result) return result;
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: [],
  };
};
