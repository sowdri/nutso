import { Schema } from "../models/schema/Schema";
import { ArraySchema } from "../models/schema/ArraySchema";
import { ArrayResult } from "../models/result/ArrayResult";
import { Result } from "../models/result/Result";
import { _validate } from "./validate";
import { isNil } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";

export const validateArray = <E, T extends E[]>(args: {
  value: T | null;
  root: unknown;
  parent?: unknown;
  schema: ArraySchema<E, T>;
  path: string[];
}): ArrayResult<E, T> => {
  const { value: arr, schema, root, parent, path } = args;

  // isApplicableFn
  if (
    schema.isApplicableFn &&
    !schema.isApplicableFn({ value: arr as any, parent, root })
  ) {
    return {
      isValid: true,
      items: [],
    };
  }

  // isnil
  if (isNil(arr)) {
    const validationResult = optionalFlagValidator({
      ...args,
      flag: schema.optional,
    });

    if (validationResult.isValid) {
      return {
        isValid: true,
        items: [],
      };
    } else {
      return {
        isValid: false,
        errorMessage: validationResult.errorMessage,
        errorPath: validationResult.errorPath,
        items: [],
      };
    }
  }

  // array min-items
  if (!isNil(schema.minItems) && arr.length < schema.minItems!) {
    return {
      isValid: false,
      errorMessage: `Should have at least ${schema.minItems} items.`,
      errorPath: path,
      items: [],
    };
  }

  // array max-items
  if (!isNil(schema.maxItems) && arr.length >= schema.maxItems!) {
    return {
      isValid: false,
      errorMessage: `Should not have more than ${schema.maxItems! - 1} items.`,
      errorPath: path,
      items: [],
    };
  }

  const items: Result<E>[] = [];

  // for each key, validate
  for (let i = 0; i < arr.length; i++) {
    // Convert index to string for path
    const itemPath = [...path, i.toString()];
    items[i] = _validate({
      ...args,
      value: arr[i],
      parent: arr as any,
      schema: schema.items,
      path: itemPath,
    });
  }

  // Check if all children are valid
  for (let i = 0; i < arr.length; i++) {
    const item = items[i];
    if (!item.isValid) {
      return {
        isValid: false,
        errorMessage: item.errorMessage,
        errorPath: item.errorPath,
        items,
      };
    }
  }

  // validationFn
  if (schema.validationFn) {
    const validationFnResult = validationFnExecutor({
      ...args,
      value: arr,
      validationFn: schema.validationFn,
    });
    if (validationFnResult && !validationFnResult.isValid) {
      return {
        isValid: false,
        errorMessage: validationFnResult.errorMessage,
        errorPath: path,
        items,
      };
    }
  }

  return {
    isValid: true,
    items,
  };
};
