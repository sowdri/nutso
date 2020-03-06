export type ValidatorFnResult = {
  errorMessage: string;
};

export type ValidationFn<T, R> = (field: T, root: R) => ValidatorFnResult | void;
