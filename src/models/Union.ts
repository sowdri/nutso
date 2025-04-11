// Get all keys from a union type (distributed)
export type AllKeys<T> = T extends any ? keyof T : never;

// Get only common keys that exist across all union members
export type CommonKeys<T> = keyof T;

// Get non-common keys (those that appear in some but not all union members)
export type UniqueKeys<T> = Exclude<AllKeys<T>, CommonKeys<T>>;

// Schema type that creates a new type will all common keys and non-common keys
// This is used to create a schema for a union type (discriminated union)
export type Union<T> = {
  [K in AllKeys<T>]: K extends CommonKeys<T>
    ? T[K]
    : T extends { [P in K]: T[K] }
    ? T[K]
    : never;
};
