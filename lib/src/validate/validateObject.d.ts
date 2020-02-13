import { ObjectResult } from "../result/ObjectResult";
import { ObjectSchema } from "../schema/ObjectSchema";
import { FieldPath } from "../models/FieldPath";
export declare const validateObject: <T>(o: T, schema: ObjectSchema<T>, fieldPath: FieldPath) => ObjectResult<T>;
