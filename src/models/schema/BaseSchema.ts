import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";
import { IsApplicableFn } from "../IsApplicableFn";

/**
 * Base schema type containing common properties shared across all schema types
 * T => Type of the value being validated
 * R => Root type of the schema. Default is 'unknown' for better composability.
 *      When using validationFn or isApplicableFn that need type safety for the root object,
 *      explicitly specify R as the root type.
 * P => Parent type
 */
export type BaseSchema<T> = {
  /** Identifies the schema type */
  type: string;

  /** Optional flag to determine if the field is required */
  optional?: OptionalFlag;

  /** Custom validation function */
  validationFn?: ValidationFn<T>;

  /**
   * Function to determine if a field is applicable in the current context
   *
   * This is specifically designed to allow users to specify if a field is applicable or not based on runtime conditions.
   * Unlike the optional flag (which marks a field as always optional), the isApplicableFn allows for dynamic determination
   * of applicability based on the values of the parent or root object.
   *
   * This is especially useful in discriminated union types where certain fields should only be present
   * for specific variants of the union, allowing for more precise schema validation.
   */
  isApplicableFn?: IsApplicableFn<T>;
};
