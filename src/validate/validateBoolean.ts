import { BooleanResult } from "../models/result/BooleanResult";
import { BooleanSchema } from "../models/schema/BooleanSchema";
import { isBoolean, isNil } from "../utils/typeChecker";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";

export const validateBoolean = <R>(o: any, root: R, schema: BooleanSchema<R>): BooleanResult => {
  // isnil
  if (isNil(o)) {
    return optionalFlagValidator(root, schema.optional);
  }

  if (!isBoolean(o)) {
    return {
      isValid: false,
      errorMessage: `Should be true or false.`,
      errorPath: [],
    };
  }

  return {
    isValid: true,
    errorMessage: ``,
    errorPath: [],
  };
};
