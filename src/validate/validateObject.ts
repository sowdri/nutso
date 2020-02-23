import { ObjectResult } from "../models/result/ObjectResult";
import { ObjectSchema } from "../models/schema/ObjectSchema";
import { FieldPath } from "../models/FieldPath";
import { isNil } from "../utils/typeChecker";
import { validate } from "./validate";
import { Result } from "../models/result/Result";
import { getKeys } from "../utils/getKeys";

function prop<T extends { [key: string]: any }, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

export const validateObject = <T extends { [key: string]: any }>(o: T, schema: ObjectSchema<T>, fieldPath: FieldPath): ObjectResult<T> => {
  //

  const result: ObjectResult<T> = {
    isValid: true,
    errorMessage: "",
    properties: {} as any,
    fieldPath
  };

  // isnil
  if (isNil(o)) {
    if (!schema.optional) {
      result.isValid = false;
      result.errorMessage = `Required field.`;
    }
  }

  const fields = getKeys(schema.properties);

  // for each key, validate
  for (const field of fields) {
    result.properties[field] = validate(o ? o[field] : null, schema.properties[field], fieldPath.concat([field as string]));
  }

  // if this node is valid, then check if all of it's children are valid
  // because the node is invalid, if any of it's children are invalid
  if (result.isValid) {
    for (const field of fields) {
      const property = result.properties[field];
      if (!property.isValid) {
        result.isValid = false;
        // result.errorMessage = property.errorMessage;
        break;
      }
    }
  }

  return result;
};
