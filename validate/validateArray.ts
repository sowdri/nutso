import { ArrayResult } from "../result/ArrayResult";
import { ArraySchema } from "../schema/ArraySchema";
import { FieldPath } from "../models/FieldPath";
import { isNil } from "../utils/typeChecker";
import { validate } from "./validate";

export const validateArray = <T>(arr: T[], schema: ArraySchema<T>, fieldPath: FieldPath): ArrayResult<T> => {
  //

  // isnil
  if (isNil(arr)) {
    if (!schema.optional) {
      return {
        isValid: false,
        errorMessage: `Required field.`,
        items: [],
        fieldPath
      };
    }
    return {
      isValid: true,
      errorMessage: ``,
      items: [],
      fieldPath
    };
  }

  const result: ArrayResult<T> = {
    isValid: true,
    errorMessage: "",
    items: [],
    fieldPath
  };

  // array min-items
  if (!isNil(schema.minItems) && arr.length < schema.minItems) {
    result.isValid = false;
    result.errorMessage = `Should have at least ${schema.minItems} items.`;
  }

  // array max-items
  if (!isNil(schema.maxItems) && arr.length >= schema.maxItems) {
    result.isValid = false;
    result.errorMessage = `Should not have more than ${schema.maxItems - 1} items.`;
  }

  // for each key, validate
  for (let i = 0; i < arr.length; i++) {
    result.items[i] = validate(arr[i], schema.item, fieldPath.concat([i]));
  }

  return result;
};
