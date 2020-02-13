import { Schema } from "../schema/Schema";
import { Result } from "../result/Result";
import { FieldPath } from "../models/FieldPath";
export declare const validate: <T>(o: T, schema: Schema<T>, fieldPath?: FieldPath) => Result<T>;
