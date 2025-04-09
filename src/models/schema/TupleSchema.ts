import { OptionalFlag } from "../OptionalFlag";
import { BaseSchema } from "./BaseSchema";

export type TupleSchema<T, R, P = unknown> = BaseSchema<T, R, P> & {
  type: "tuple";
};
