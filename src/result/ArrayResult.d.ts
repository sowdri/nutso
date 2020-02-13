import { Result } from "./Result";
import { BaseResult } from "./BaseResult";
export declare type ArrayResult<T> = BaseResult & {
    items: Result<T>[];
};
