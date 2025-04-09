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
  path: string[];
}): BooleanResult => {
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

  if (!isBoolean(value)) {
    return {
      isValid: false,
      errorMessage: `Should be true or false.`,
      errorPath: path,
    };
  }

  // validationFn
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
