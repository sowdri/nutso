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
    if (schema.required) {
      result.isValid = false;
      result.errorMessage = `Required field.`;
    }
  }

  // for each key, validate
  for (const key of Object.keys(schema.properties)) {
    //@ts-ignore
    result.properties[key] = validate(o ? o[key] : null, schema.properties[key], fieldPath.concat([key]));
  }

  return result;
};
