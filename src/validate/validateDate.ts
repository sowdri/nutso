import { DateResult } from "../models/result/DateResult";
import { DateSchema } from "../models/schema/DateSchema";
import { isDate, isNil } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";

export const validateDate = <R, P>(args: { value: any; root: R; parent: P; schema: DateSchema<R, P> }): DateResult => {
  const { value, schema } = args;
  // isnil
  if (isNil(value)) {
    return optionalFlagValidator({ ...args, flag: schema.optional });
  }

  // is date object
  if (!isDate(value)) {
    return {
      isValid: false,
      errorMessage: `Should be a valid date.`,
      errorPath: [],
    };
  }

  const date = value;

  // custom validationFn
  if (schema.validationFn) {
    const result = validationFnExecutor({ ...args, value: date, validationFn: schema.validationFn });
    if (result) return result;
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: [],
  };
};
