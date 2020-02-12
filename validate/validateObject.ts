import { ObjectResult } from "../result/ObjectResult";
import { ObjectSchema } from "../schema/ObjectSchema";
import { FieldPath, fieldPathStr } from "../utils/FieldPath";
import { isNil } from "../utils/is";
import { validate } from "./validate";

export const validateObject = <T>(o: T, schema: ObjectSchema<T>, fieldPath: FieldPath): ObjectResult<T> => {
  //
  const path = fieldPathStr(fieldPath);

  const result: ObjectResult<T> = {
    isValid: true,
    errorMessage: "",
    properties: {} as any
  };

  // isnil
  if (isNil(o)) {
    if (schema.required) {
      result.isValid = false;
      result.errorMessage = `${path} is required.`;
    }
  }

  // for each key, validate
  for (const key of Object.keys(schema.properties)) {
    //@ts-ignore
    result.properties[key] = validate(o ? o[key] : null, schema.properties[key], fieldPath.concat([key]));
  }

  return result;
};
