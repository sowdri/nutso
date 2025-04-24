export type ValidatorFnResult = {
  errorMessage: string;
};

export type ValidationFn<T> = (args: {
  value: T;
  parent?: unknown;
  root: unknown;
}) => ValidatorFnResult | void;
