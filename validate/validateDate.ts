import { DateResult } from "../result/DateResult";
import { DateSchema } from "../schema/DateSchema";
import { FieldPath } from "../models/FieldPath";
import { isDate, isNil } from "../utils/typeChecker";

export const validateDate = (o: any, schema: DateSchema, fieldPath: FieldPath): DateResult => {
  //

  // isnil
  if (isNil(o)) {
    if (!schema.optional) {
      return {
        isValid: false,
        errorMessage: `Required field.`,
        fieldPath
      };
    }
    return {
      isValid: true,
      errorMessage: "",
      fieldPath
    };
  }

  if (!isDate(o)) {
    return {
      isValid: false,
      errorMessage: `Should be a valid date.`,
      fieldPath
    };
  }

  return {
    isValid: true,
    errorMessage: ``,
    fieldPath
  };
};
