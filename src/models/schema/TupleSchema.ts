import { OptionalFlag } from "../OptionalFlag";

export type TupleSchema<T, R> = {
  type: "tuple";
  optional?: OptionalFlag<R>;
};
