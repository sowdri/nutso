import { ObjectResult } from "../result/ObjectResult";
import { ObjectSchema } from "../schema/ObjectSchema";
import { FieldPath, fieldPathStr } from "../utils/FieldPath";
import { isNil } from "../utils/is";
import { validate } from "./validate";
import { ArraySchema } from "../schema/ArraySchema";
import { ArrayResult } from "../result/ArrayResult";

export const validateArray = <T>(arr: T[], schema: ArraySchema<T>, fieldPath: FieldPath): ArrayResult<T> => {
  //
  const path = fieldPathStr(fieldPath);

  // isnil
  if (isNil(arr)) {
    if (schema.required) {
      return {
        isValid: false,
        errorMessage: `${path} is required.`,
        items: []
      };
    }
    return {
      isValid: true,
      errorMessage: ``,
      items: []
    };
  }

  const result: ArrayResult<T> = {
    isValid: true,
    errorMessage: "",
    items: []
  };

  // array min-items
  if (!isNil(schema.minItems) && arr.length < schema.minItems) {
    result.isValid = false;
    result.errorMessage = `${path} should have at least ${schema.minItems} items.`;
  }

  // array max-items
  if (!isNil(schema.maxItems) && arr.length >= schema.maxItems) {
    result.isValid = false;
    result.errorMessage = `${path} should not have more than ${schema.maxItems - 1} items.`;
  }

  // for each key, validate
  for (let i = 0; i < arr.length; i++) {
    result.items[i] = validate(arr[i], schema.item, fieldPath.concat([i]));
  }

  return result;
};
