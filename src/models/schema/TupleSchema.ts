import { OptionalFlag } from "../OptionalFlag";

export type TupleSchema<T, P = unknown> = {
  type: "tuple";
  optional?: OptionalFlag<P>;
};
