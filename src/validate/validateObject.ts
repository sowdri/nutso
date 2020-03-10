import { ObjectResult } from "../models/result/ObjectResult";
import { ObjectSchema } from "../models/schema/ObjectSchema";
import { isNil } from "../utils/typeChecker";
import { _validate } from "./validate";

export const isRegex = (str: string) => {
  return str.startsWith("/") && str.endsWith("/");
};

export const getRegex = (str: string) => {
  return new RegExp(`^${str.substr(1, str.length - 1)}$`);
};

export const validateObject = <T extends { [key: string]: any }, R>(
  o: T | null,
  root: R,
  schema: ObjectSchema<T, R>
): ObjectResult<T> => {
  //
  const result: ObjectResult<T> = {
    isValid: true,
    errorMessage: "",
    properties: {} as any,
    errorPath: []
  };

  // isnil - no further traversal required
  if (isNil(o)) {
    // valid
    if (schema.optional) {
      result.isValid = true;
      return result;
    }
    // invalid
    result.isValid = false;
    result.errorMessage = `Required field.`;
    return result;
  }

  const obj = o as T;
  const processedFields: string[] = [];

  // for each static key, validate
  for (let field in schema.properties) {
    if (isRegex(field)) continue;
    result.properties[field] = _validate(o ? o[field] : null, root, schema.properties[field]);
    processedFields.push(field);
  }

  // for each regex in schema.properties
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
      result.properties[key] = _validate(o ? o[key] : null, root, schema.properties[field]);
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
