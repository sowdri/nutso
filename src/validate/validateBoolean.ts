import { BooleanResult } from "../models/result/BooleanResult";
import { BooleanSchema } from "../models/schema/BooleanSchema";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";
import { isBoolean, isNil } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";

export const validateBoolean = <P>(args: { value: any; parent: P; schema: BooleanSchema<P> }): BooleanResult => {
  const { value, parent, schema } = args;
  // isnil
  if (isNil(value)) {
    return optionalFlagValidator({ parent, flag: schema.optional });
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
    const result = validationFnExecutor({ value, validationFn: schema.validationFn, parent });
    if (result) return result;
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: [],
  };
};
