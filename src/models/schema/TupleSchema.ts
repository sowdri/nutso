import { OptionalFlag } from "../OptionalFlag";

export type TupleSchema<T, P> = {
  type: "tuple";
  optional?: OptionalFlag<P>;
};
