export type ValidatorFnResult = {
  errorMessage: string;
};

export type ValidationFn<T, R, P> = (args: { value: T; parent: P; root: R }) => ValidatorFnResult | void;
