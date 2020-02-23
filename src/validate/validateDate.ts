import { DateResult } from "../models/result/DateResult";
import { DateSchema } from "../models/schema/DateSchema";
import { isDate, isNil } from "../utils/typeChecker";

export const validateDate = (o: any, schema: DateSchema): DateResult => {
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

  if (!isDate(o)) {
    return {
      isValid: false,
      errorMessage: `Should be a valid date.`,
      errorPath: []
    };
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: []
  };
};
