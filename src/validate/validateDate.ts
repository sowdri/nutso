import { DateResult } from "../models/result/DateResult";
import { DateSchema } from "../models/schema/DateSchema";
import { isDate, isNil } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";

export const validateDate = <R>(o: any, root: R, schema: DateSchema<R>): DateResult => {
  // isnil
  if (isNil(o)) {
    if (!schema.optional) {
      return {
        isValid: false,
        errorMessage: `Required field.`,
        errorPath: [],
      };
    }
    return {
      isValid: true,
      errorMessage: "",
      errorPath: [],
    };
  }

  // is date object
  if (!isDate(o)) {
    return {
      isValid: false,
      errorMessage: `Should be a valid date.`,
      errorPath: [],
    };
  }

  const date = o;

  // custom validationFn
  if (schema.validationFn) {
    const result = validationFnExecutor({ value: date, validationFn: schema.validationFn, root });
    if (result) return result;
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: [],
  };
};
