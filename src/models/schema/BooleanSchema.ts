import { OptionalFlag } from "../OptionalFlag";

export type BooleanSchema<P = unknown> = {
  type: "boolean";
  optional?: OptionalFlag<P>;
};
