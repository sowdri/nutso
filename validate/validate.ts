import { Schema } from "../schema/Schema";
import { Result } from "../result/Result";
import { validateString } from "./validateString";
import { StringSchema } from "../schema/StringSchema";
import { NumberSchema } from "../schema/NumberSchema";
import { validateNumber } from "./validateNumber";
import { BooleanSchema } from "../schema/BooleanSchema";
import { validateBoolean } from "./validateBoolean";
import { ObjectSchema } from "../schema/ObjectSchema";
import { validateObject } from "./validateObject";
import { FieldPath } from "../utils/FieldPath";
import { validateArray } from "./validateArray";
import { ArraySchema } from "../schema/ArraySchema";

export const validate = <T>(o: T, schema: Schema<T>, fieldPath: FieldPath): Result<T> => {
  //
  if (!schema) throw new Error("Schema should not be null");

  /**
   * validate object against the schema
   */
  switch (schema.type) {
    case "number":
      return validateNumber(o, schema as NumberSchema, fieldPath) as Result<T>;
    case "string":
      return validateString(o, schema as StringSchema, fieldPath) as Result<T>;
    case "boolean":
      return validateBoolean(o, schema as BooleanSchema, fieldPath) as Result<T>;
    case "array":
      return validateArray(o as any, schema as ArraySchema<T>, fieldPath) as Result<T>;
    case "object":
      return validateObject(o, schema as ObjectSchema<T>, fieldPath) as Result<T>;

    //   return vr;
    // case "date":
    //   validateDate(o, schema, path, vr);
    //   return vr;
    // case "number":
    //   validateNumber(o, schema, path, vr);
    //   return vr;
    // case "boolean":
    //   validateBoolean(o, schema, path, vr);
    //   return vr;
    // case "array":
    //   validateArray(o, schema, path, vr);
    //   return vr;
    // case "map":
    //   validateMap(o, schema, path, vr);
    //   return vr;
  }
  return null as any;
};
