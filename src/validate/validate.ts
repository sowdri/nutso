import { Schema } from "../models/schema/Schema";
import { Result } from "../models/result/Result";
import { validateString } from "./validateString";
import { StringSchema } from "../models/schema/StringSchema";
import { NumberSchema } from "../models/schema/NumberSchema";
import { validateNumber } from "./validateNumber";
import { BooleanSchema } from "../models/schema/BooleanSchema";
import { validateBoolean } from "./validateBoolean";
import { ObjectSchema } from "../models/schema/ObjectSchema";
import { validateObject } from "./validateObject";
import { FieldPath } from "../models/FieldPath";
import { validateArray } from "./validateArray";
import { ArraySchema } from "../models/schema/ArraySchema";
import { validateDate } from "./validateDate";
import { DateSchema } from "../models/schema/DateSchema";

export const validate = <T, R>(o: T | null, root: R, schema: Schema<T, R>): Result<T> => {
  //
  if (!schema) {
    throw new Error("Schema should not be null");
  }

  /**
   * validate object against the schema
   */
  switch (schema.type) {
    case "number":
      return validateNumber(o, schema as NumberSchema) as Result<T>;
    case "string":
      return validateString(o, root, schema as StringSchema<R>) as Result<T>;
    case "boolean":
      return validateBoolean(o, schema as BooleanSchema) as Result<T>;
    case "array":
      return validateArray(o as any, root, schema as ArraySchema<T, R>) as Result<T>;
    case "object":
      return validateObject(o, root, schema as ObjectSchema<T, R>) as Result<T>;
    case "date":
      return validateDate(o, schema as DateSchema) as Result<T>;
  }
  throw new Error(`Unhandled data type`);
};
