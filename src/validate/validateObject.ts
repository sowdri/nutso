import {
  ObjectResult,
  ObjectSuccessResult,
} from "../models/result/ObjectResult";
import { ObjectSchema } from "../models/schema/ObjectSchema";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";
import { isNil } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";
import { _validate } from "./validate";
import { Result } from "../models/result/Result";
import { Schema } from "../models/schema/Schema";

/**
 * A field is represented by a regex when it starts with ^ and ends with $
 * For example: "^.*$" means match any string
 * @param field string
 * @returns boolean
 */
export const isRegex = (field: string): boolean => {
  return field.startsWith("^") && field.endsWith("$");
};

// convert string to regex
export const getRegex = (field: string): RegExp => {
  try {
    if (!isRegex(field)) {
      throw new Error("Not a regex");
    }
    return new RegExp(field);
  } catch (e) {
    console.error(`Error parsing regex: ${field}`);
    return /./; // match all
  }
};

export const validateObject = <T extends { [key: string]: any }, R, P>(args: {
  value: T | null;
  root: R;
  parent: P;
  schema: ObjectSchema<T, R, P>;
  path: string[];
}): ObjectResult<T> => {
  //
  const { value, schema, root, parent, path = [] } = args;

  // Check if field is applicable
  if (
    schema.isApplicableFn &&
    !schema.isApplicableFn({ value: value as any, parent, root })
  ) {
    return {
      isValid: true,
      properties: {} as any,
    };
  }

  const result: ObjectResult<T> = {
    isValid: true,
    properties: {} as any,
  };

  // isnil
  if (isNil(value)) {
    const validationResult = optionalFlagValidator({
      ...args,
      flag: schema.optional,
    });

    if (validationResult.isValid) {
      return {
        ...result,
        properties: {} as any,
      };
    } else {
      return {
        isValid: false,
        errorMessage: validationResult.errorMessage,
        errorPath: validationResult.errorPath,
        properties: {} as any,
      };
    }
  }

  const obj = value as T;
  const processedFields: string[] = [];
  const properties: Record<string, Result<any>> = {} as any;

  // for each static key, validate
  for (let field in schema.properties) {
    if (isRegex(field)) continue;
    const fieldKey = field as Extract<keyof T, string>;
    const fieldPath = [...path, field];
    properties[fieldKey] = _validate<any, R, T>({
      ...args,
      value: value ? value[fieldKey] : null,
      parent: value,
      schema: schema.properties[field] as Schema<any, R, T>,
      path: fieldPath,
    });
    processedFields.push(field);
  }

  // for each regex validate all matching keys
  for (let field in schema.properties) {
    if (!isRegex(field)) continue; // not-regex
    const regex = getRegex(field);
    // for each key
    for (let key in obj) {
      /**
       * Already processed field. This will happen if the regex matches a wide range of fields, like ".*"
       * and the properties also defines specific fields like "red": {}, "blue": {} etc ...
       */
      if (processedFields.includes(key)) continue;
      if (!regex.test(key)) continue;
      const keyAsT = key as Extract<keyof T, string>;
      const keyPath = [...path, key];
      properties[keyAsT] = _validate<any, R, T>({
        ...args,
        value: value ? value[keyAsT] : null,
        parent: value,
        schema: schema.properties[field] as Schema<any, R, T>,
        path: keyPath,
      });
      processedFields.push(key);
    }
  }

  // Check if all children are valid
  for (let field of processedFields) {
    const fieldKey = field as Extract<keyof T, string>;
    const property = properties[fieldKey];
    if (!property.isValid) {
      return {
        isValid: false,
        errorMessage: property.errorMessage,
        errorPath: property.errorPath,
        properties: properties as any,
      };
    }
  }

  // validationFn
  if (schema.validationFn) {
    const validationFnResult = validationFnExecutor({
      ...args,
      value,
      validationFn: schema.validationFn,
    });
    if (validationFnResult && !validationFnResult.isValid) {
      return {
        isValid: false,
        errorMessage: validationFnResult.errorMessage,
        errorPath: path,
        properties: properties as any,
      };
    }
  }

  return {
    isValid: true,
    properties: properties as any,
  };
};
