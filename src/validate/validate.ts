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
export const _validate = <T, R, P>(args: {
  value: T | null;
  root: R;
  parent: P;
  schema: Schema<T, R, P>;
}): Result<T> => {
  //

  if (!args.schema) {
    throw new Error("Schema should not be null");
  }

  /**
   * validate object against the schema
   */
  switch (args.schema.type) {
    case "number":
      return validateNumber({ ...args, schema: args.schema as NumberSchema<R> }) as Result<T>;
    case "string":
      return validateString({ ...args, schema: args.schema as StringSchema<R> }) as Result<T>;
    case "boolean":
      return validateBoolean({ ...args, schema: args.schema as BooleanSchema<R> }) as Result<T>;
    case "array":
      // TODO array schema type remove any
      return validateArray({ ...args, value: args.value as any, schema: args.schema as any }) as Result<T>;
    case "object":
      return validateObject({ ...args, schema: args.schema }) as Result<T>;
    case "date":
      return validateDate({ ...args, schema: args.schema as DateSchema<R> }) as Result<T>;
  }
  throw new Error(`Unhandled data type`);
};

// public api
export const validate = <T, R = T>(value: T, schema: Schema<T, R>): Result<T> => {
  return _validate({ value, root: value as unknown as R, parent: null, schema });
};

// const api = <T, R = T>(args: { value: T; schema: Schema<T, R> }) => {
//   return val({
//     ...args,
//     root: args.value as unknown as R,
//     parent: null,
//   });
// };

// const val = <T, P, R>(args: { value: T; parent: P; root: R; schema: Schema<T, R> }) => {
//   if (!args.schema) {
//     throw new Error("Schema should not be null");
//   }
//   switch (args.schema.type) {
//     case "number":
//       return validateNumber({ ...args, schema: args.schema as NumberSchema<R> }) as Result<T>;
//     default:
//       throw new Error(`Unhandled data type`);
//     //   case "string":
//     //     return validateString({ ...args, schema: args.schema as StringSchema<R> }) as Result<T>;
//     //   case "boolean":
//     //     return validateBoolean({ ...args, schema: args.schema as BooleanSchema<R> }) as Result<T>;
//     //   case "array":
//     //     return validateArray({ value: args.value as any, parent: args.parent, schema: args.schema as any }) as Result<T>;
//     //   case "object":
//     //     return validateObject({ ...args, schema: args.schema }) as Result<T>;
//     //   case "date":
//     //     return validateDate({ ...args, schema: args.schema as DateSchema<R> }) as Result<T>;
//     // }
//     // throw new Error(`Unhandled data type`);
//   }
// };
