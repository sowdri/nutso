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

export const validate = <T>(o: T, schema: Schema<T>): Result<T> => {
  //
  if (!schema) throw new Error("Schema should not be null");

  /**
   * validate object against the schema
   */
  switch (schema.type) {
    case "number":
      return validateNumber(o, schema as NumberSchema, []) as Result<T>;
    case "string":
      return validateString(o, schema as StringSchema, []) as Result<T>;
    case "boolean":
      return validateBoolean(o, schema as BooleanSchema, []) as Result<T>;
    case "object":
      return validateObject(o, schema as ObjectSchema<T>, []) as Result<T>;

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
