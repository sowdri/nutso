import { Result } from "../models/result/Result";
import { BooleanSchema } from "../models/schema/BooleanSchema";
import { DateSchema } from "../models/schema/DateSchema";
import { NumberSchema } from "../models/schema/NumberSchema";
import { Schema } from "../models/schema/Schema";
import { StringSchema } from "../models/schema/StringSchema";
import { validateArray } from "./validateArray";
import { validateBoolean } from "./validateBoolean";
import { validateDate } from "./validateDate";
import { validateNumber } from "./validateNumber";
import { validateObject } from "./validateObject";
import { validateString } from "./validateString";

/**
 * This is an internal API that takes the root as an argument
 * and called recursively from `validateObject` and `validateArray` methods
 *
 * @param value
 * @param parent
 * @param schema
 */
export const _validate = <T, P>(args: { value: T | null; parent: P; schema: Schema<T, P> }): Result<T> => {
  //

  if (!args.schema) {
    throw new Error("Schema should not be null");
  }

  /**
   * validate object against the schema
   */
  switch (args.schema.type) {
    case "number":
      return validateNumber({ ...args, schema: args.schema as NumberSchema<P> }) as Result<T>;
    case "string":
      return validateString({ ...args, schema: args.schema as StringSchema<P> }) as Result<T>;
    case "boolean":
      return validateBoolean({ ...args, schema: args.schema as BooleanSchema<P> }) as Result<T>;
    case "array":
      return validateArray({ value: args.value as any, parent: args.parent, schema: args.schema as any }) as Result<T>;
    case "object":
      return validateObject({ ...args, schema: args.schema }) as Result<T>;
    case "date":
      return validateDate({ ...args, schema: args.schema as DateSchema<P> }) as Result<T>;
  }
  throw new Error(`Unhandled data type`);
};

// public api
export const validate = <T>(value: T, schema: Schema<T>): Result<T> => {
  return _validate({ value, parent: null as any, schema });
};
