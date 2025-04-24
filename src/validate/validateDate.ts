import { DateResult } from "../models/result/DateResult";
import { DateSchema } from "../models/schema/DateSchema";
import { isDate, isNil } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";

export const validateDate = (args: {
  value: any;
  root: unknown;
  parent?: unknown;
  schema: DateSchema;
  path: string[];
}): DateResult => {
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

  // is date object
  if (!isDate(value)) {
    return {
      isValid: false,
      errorMessage: `Should be a valid date.`,
      errorPath: path,
    };
  }

  const date = value;

  // custom validationFn
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
