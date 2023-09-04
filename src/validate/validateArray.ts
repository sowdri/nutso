import { ArrayResult } from "../models/result/ArrayResult";
import { ArraySchema } from "../models/schema/ArraySchema";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";
import { isNil } from "../utils/typeChecker";
import { _validate } from "./validate";

export const validateArray = <E, T extends E[], R, P>(args: {
  value: T | null;
  root: R;
  parent: P;
  schema: ArraySchema<E, T, R, P>;
}): ArrayResult<E> => {
  const { value: arr, schema } = args;
  // isnil
  if (isNil(arr)) {
    return { ...optionalFlagValidator({ ...args, flag: schema.optional }), items: [] };
  }

  const result: ArrayResult<E> = {
    isValid: true,
    errorMessage: "",
    items: [],
    errorPath: [],
  };

  // array min-items
  if (!isNil(schema.minItems) && arr.length < schema.minItems!) {
    result.isValid = false;
    result.errorMessage = `Should have at least ${schema.minItems} items.`;
  }

  // array max-items
  if (!isNil(schema.maxItems) && arr.length >= schema.maxItems!) {
    result.isValid = false;
    result.errorMessage = `Should not have more than ${schema.maxItems! - 1} items.`;
  }

  // for each key, validate
  for (let i = 0; i < arr.length; i++) {
    result.items[i] = _validate({ ...args, value: arr[i], parent: arr as any, schema: schema.items });
  }

  // if this node is valid, then check if all of it's children are valid
  // because the node is invalid, if any of it's children are invalid
  if (result.isValid) {
    for (let i = 0; i < arr.length; i++) {
      const item = result.items[i];
      if (!item.isValid) {
        result.isValid = false;
        result.errorMessage = item.errorMessage;
        result.errorPath = [i, ...item.errorPath];
        break;
      }
    }
  }

  return result;
};
