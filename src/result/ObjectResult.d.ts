import { Result } from "./Result";
import { BaseResult } from "./BaseResult";
export declare type ObjectResult<T> = BaseResult & {
    properties: {
        [P in keyof T]: Result<T[P]>;
    };
};
