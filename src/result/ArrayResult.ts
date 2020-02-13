import { Result } from "./Result";
import { BaseResult } from "./BaseResult";

export type ArrayResult<T> = BaseResult & {
  items: Result<T>[];
};
