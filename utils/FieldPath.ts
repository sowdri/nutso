/**
 * A type to represent the path of any field from the root object
 * Number is required to navigate arrays
 */
export type FieldPath = (string | number)[];
export const fieldPathStr = (fieldPath: FieldPath) => {
  if (!fieldPath.length) return "Object";
  return fieldPath.join(".");
};
