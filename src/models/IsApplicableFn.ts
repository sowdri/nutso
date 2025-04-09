/**
 * Function type that determines if a field is applicable based on the current value, parent, and root object
 *
 * This function is specifically created to allow users to specify if a specific field is applicable or not.
 * This is quite different from the optional flag because this will be used in scenarios like discriminated
 * union types to specify if a field is applicable depending on the values of the parent or the root object.
 *
 * @returns A boolean indicating whether the field is applicable in the current context
 *
 * T => Type of the value being validated
 * R => Root type of the schema
 * P => Parent type
 */
export type IsApplicableFn<T, R, P> = (args: {
  value: T;
  parent: P;
  root: R;
}) => boolean;
