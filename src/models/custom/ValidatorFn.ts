export type ValidatorFnResult = {
  errorMessage: string;
};

export type ValidatorFn<T, R> = (field: T, root: R) => ValidatorFnResult | void;
