import { ObjectResult } from "../models/result/ObjectResult";
import { ObjectSchema } from "../models/schema/ObjectSchema";
import { isNil } from "../utils/typeChecker";
import { _validate } from "./validate";

export const validateObject = <T extends { [key: string]: any }, R>(o: T | null, root: R, schema: ObjectSchema<T, R>): ObjectResult<T> => {
  //
  const result: ObjectResult<T> = {
    isValid: true,
    errorMessage: "",
    properties: {} as any,
    errorPath: []
  };

  // isnil
  if (isNil(o)) {
    // nil & undefined - no further traversal
    if (schema.optional) {
      return result;
    }
    result.isValid = false;
    result.errorMessage = `Required field.`;
  }

  // for each key, validate
  for (let field in schema.properties) {
    result.properties[field] = _validate(o ? o[field] : null, root, schema.properties[field]);
  }

  // if this node is valid, then check if all of it's children are valid
  // because the node is invalid, if any of it's children are invalid
  if (result.isValid) {
    for (let field in schema.properties) {
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
