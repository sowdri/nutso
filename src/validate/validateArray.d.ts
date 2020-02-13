import { ArrayResult } from "../result/ArrayResult";
import { ArraySchema } from "../schema/ArraySchema";
import { FieldPath } from "../models/FieldPath";
export declare const validateArray: <T>(arr: T[], schema: ArraySchema<T>, fieldPath: FieldPath) => ArrayResult<T>;
