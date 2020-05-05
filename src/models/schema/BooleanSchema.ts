import { OptionalFlag } from "../OptionalFlag";

export type BooleanSchema<R> = {
  type: "boolean";
  optional?: OptionalFlag<R>;
};
