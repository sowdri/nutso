import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

/**
 * Base schema type containing common properties shared across all schema types
 * T => Type of the value being validated
 * R => Root type of the schema
 * P => Parent type
 */
export type BaseSchema<T, R = T, P = unknown> = {
  /** Identifies the schema type */
  type: string;

  /** Optional flag to determine if the field is required */
  optional?: OptionalFlag<R, P>;

  /** Custom validation function */
  validationFn?: ValidationFn<T, R, P>;
};
