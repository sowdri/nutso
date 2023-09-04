import { BooleanResult } from "../models/result/BooleanResult";
import { BooleanSchema } from "../models/schema/BooleanSchema";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";
import { isBoolean, isNil } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";

export const validateBoolean = <R, P>(args: {
  value: any;
  root: R;
  parent: P;
  schema: BooleanSchema<R, P>;
}): BooleanResult => {
  const { value, schema } = args;
  // isnil
  if (isNil(value)) {
    return optionalFlagValidator({ ...args, flag: schema.optional });
  }

  if (!isBoolean(value)) {
    return {
      isValid: false,
      errorMessage: `Should be true or false.`,
      errorPath: [],
    };
  }

  // validationFn
  if (schema.validationFn) {
    const result = validationFnExecutor({ ...args, value, validationFn: schema.validationFn });
    if (result) return result;
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: [],
  };
};
