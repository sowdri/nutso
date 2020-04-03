import { ValidationFn } from "../models/ValidationFn";
import { ValidationResult } from "..";

export const validationFnExecutor = <T, R>(args: {
  value: T;
  validationFn: ValidationFn<T, R>;
  root: R;
}): ValidationResult | undefined => {
  try {
    const result = args.validationFn(args.value, args.root);
    if (result) {
      return {
        ...result, // created by user, so put that first, such that `isValid` and `errorPath` are not overwritten
        isValid: false,
        errorPath: []
      };
    }
  } catch (e) {
    if (e.message) {
      return {
        errorMessage: e.message,
        isValid: false,
        errorPath: []
      };
    }
    console.error(`Exception executing executor function`);
    return {
      errorMessage: `Exception in validationFn`,
      isValid: false,
      errorPath: []
    };
  }
};
