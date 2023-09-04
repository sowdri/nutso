import { OptionalFlag } from "../OptionalFlag";

export type TupleSchema<T, R, P = unknown> = {
  type: "tuple";
  optional?: OptionalFlag<R, P>;
};
