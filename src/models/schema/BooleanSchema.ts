import { OptionalFlag } from "../OptionalFlag";

export type BooleanSchema<P> = {
  type: "boolean";
  optional?: OptionalFlag<P>;
};
