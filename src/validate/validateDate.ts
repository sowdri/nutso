import { DateResult } from "../models/result/DateResult";
import { DateSchema } from "../models/schema/DateSchema";
import { isDate, isNil } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";

export const validateDate = <P>(args: { value: any; parent: P; schema: DateSchema<P> }): DateResult => {
  const { value, parent, schema } = args;
  // isnil
  if (isNil(value)) {
    return optionalFlagValidator({ parent, flag: schema.optional });
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
    const result = validationFnExecutor({ value: date, validationFn: schema.validationFn, parent: parent });
    if (result) return result;
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: [],
  };
};
