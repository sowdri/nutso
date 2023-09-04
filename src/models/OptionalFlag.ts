/*
type Customer = {
  name: string;
  dob: Date;
  height: number;
  isSuperAdmin: boolean;
};

const customerSchema: Schema<Customer> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 24,
    },
    dob: {
      type: "date",
      optional: ({ root }) => {
        if (root.isSuperAdmin) return true;
        return false;
      },
    },
    height: {
      type: "number",
      min: 0.1,
      max: 7.5,
    },
    isSuperAdmin: {
      type: "boolean",
    },
  },
};
*/
/**
 * value: T cannot be passed on to this function because we cannot use the value to check if this field can be undefined or null.
 */

export type OptionalFlag<R, P> = boolean | ((args: { root: R; parent?: P }) => boolean);
