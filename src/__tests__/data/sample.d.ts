import { Schema } from "../../schema/Schema";
interface Customer {
    name: string;
    sex: "male" | "female";
    dob: Date;
    age: number;
    favouriteColors: string[];
    address: Address;
}
interface Address {
    line1: string;
    city: string;
    state: string;
    country: string;
    postcode: number;
}
export declare const customerSchema1: Schema<Customer>;
export declare const addressSchema1: Schema<Address>;
export declare const customerSchema2: Schema<Customer>;
export {};
