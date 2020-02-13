import { ObjectResult } from "../result/ObjectResult";
import { ObjectSchema } from "../schema/ObjectSchema";
import { FieldPath } from "../models/FieldPath";
import { isNil } from "../utils/typeChecker";
import { validate } from "./validate";

export const validateObject = <T>(o: T, schema: ObjectSchema<T>, fieldPath: FieldPath): ObjectResult<T> => {
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
  const fields = Object.keys(schema.properties);

  // for each key, validate
  for (const field of fields) {
    //@ts-ignore
    result.properties[field] = validate(o ? o[field] : null, schema.properties[field], fieldPath.concat([field]));
  }

  // object is invalid if any of it's properties are invalid
  for (const field of fields) {
    //@ts-ignore
    if (!result.properties[field].isValid) {
      result.isValid = false;
      break;
    }
  }

  return result;
};
