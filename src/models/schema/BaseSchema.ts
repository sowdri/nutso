import { ValidatorFn } from "../custom/ValidatorFn";

export type BaseSchema = {
  optional?: boolean;
  validatorFn?: ValidatorFn;
};
