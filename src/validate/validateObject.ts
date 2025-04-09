import { ObjectResult } from "../models/result/ObjectResult";
import { ObjectSchema } from "../models/schema/ObjectSchema";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";
import { isNil } from "../utils/typeChecker";
import { validationFnExecutor } from "../utils/validationFnExecutor";
import { _validate } from "./validate";
import { Result } from "../models/result/Result";
import { Schema } from "../models/schema/Schema";

export const isRegex = (str: string) => {
  return str.startsWith("/") && str.endsWith("/");
};

export const getRegex = (str: string) => {
  return new RegExp(`^${str.slice(1, -1)}$`);
};

export const validateObject = <T extends { [key: string]: any }, R, P>(args: {
  value: T | null;
  root: R;
  parent: P;
  schema: ObjectSchema<T, R, P>;
}): ObjectResult<T> => {
  //
  const { value, schema, root, parent } = args;

  // Check if field is applicable
  if (
    schema.isApplicableFn &&
    !schema.isApplicableFn({ value: value as any, parent, root })
  ) {
    return {
      isValid: true,
      errorMessage: ``,
      errorPath: [],
      properties: {} as any,
    };
  }

  const result: ObjectResult<T> = {
    isValid: true,
    errorMessage: "",
    properties: {} as any,
    errorPath: [],
  };

  // isnil
  if (isNil(value)) {
    return {
      ...optionalFlagValidator({ ...args, flag: schema.optional }),
      properties: {} as any,
    };
  }

  const obj = value as T;
  const processedFields: string[] = [];

  // for each static key, validate
  for (let field in schema.properties) {
    if (isRegex(field)) continue;
    const fieldKey = field as Extract<keyof T, string>;
    (result.properties as any)[fieldKey] = _validate<any, R, T>({
      ...args,
      value: value ? value[fieldKey] : null,
      parent: value,
      schema: schema.properties[field] as Schema<any, R, T>,
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
      (result.properties as any)[keyAsT] = _validate<any, R, T>({
        ...args,
        value: value ? value[keyAsT] : null,
        parent: value,
        schema: schema.properties[field] as Schema<any, R, T>,
      });
      processedFields.push(key);
    }
  }

  // if this node is valid, then check if all of it's children are valid
  // because the node is invalid, if any of it's children are invalid
  if (result.isValid) {
    for (let field of processedFields) {
      const fieldKey = field as Extract<keyof T, string>;
      const property = result.properties[fieldKey as keyof T];
      if (!property.isValid) {
        result.isValid = false;
        result.errorMessage = property.errorMessage;
        result.errorPath = [field, ...property.errorPath];
        break;
      }
    }
  }

  // validationFn
  // validationFn will be called only if the object is valid at this stage
  if (result.isValid && schema.validationFn) {
    const validationFnResult = validationFnExecutor({
      ...args,
      value,
      validationFn: schema.validationFn,
    });
    if (validationFnResult) {
      result.isValid = false;
      result.errorMessage = validationFnResult.errorMessage;
      // TODO test this error path
      result.errorPath = [];
    }
  }

  return result;
};
