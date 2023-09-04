import { ObjectResult } from "../models/result/ObjectResult";
import { ObjectSchema } from "../models/schema/ObjectSchema";
import { optionalFlagValidator } from "../utils/optionalFlagValidator";
import { isNil } from "../utils/typeChecker";
import { _validate } from "./validate";

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
  const { value, schema } = args;

  const result: ObjectResult<T> = {
    isValid: true,
    errorMessage: "",
    properties: {} as any,
    errorPath: [],
  };

  // isnil
  if (isNil(value)) {
    return { ...optionalFlagValidator({ ...args, flag: schema.optional }), properties: {} as any };
  }

  const obj = value as T;
  const processedFields: string[] = [];

  // for each static key, validate
  for (let field in schema.properties) {
    if (isRegex(field)) continue;
    result.properties[field] = _validate({
      ...args,
      value: value ? value[field] : null,
      parent: value,
      schema: schema.properties[field],
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
      result.properties[key] = _validate({
        ...args,
        value: value ? value[key] : null,
        parent: value,
        schema: schema.properties[field],
      });
      processedFields.push(key);
    }
  }

  // if this node is valid, then check if all of it's children are valid
  // because the node is invalid, if any of it's children are invalid
  if (result.isValid) {
    for (let field of processedFields) {
      const property = result.properties[field];
      if (!property.isValid) {
        result.isValid = false;
        result.errorMessage = property.errorMessage;
        result.errorPath = [field, ...property.errorPath];
        break;
      }
    }
  }

  return result;
};
