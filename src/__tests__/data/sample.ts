import { Schema } from "../../models/schema/Schema";
import { Result } from "../../models/result/Result";

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

export const customerSchema1: Schema<Customer> = {
  type: "object",
  optional: false,
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 24
    },
    sex: {
      type: "string",

      pattern: /male|female/
    },
    dob: {
      type: "date",
      optional: false
    },
    age: {
      type: "number",
      min: 0,
      max: 100
    },
    favouriteColors: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      optional: false,
      items: {
        type: "string",
        pattern: /(blue)|(green)/
      }
    },
    address: {
      type: "object",
      optional: false,
      properties: {
        line1: {
          type: "string",
          optional: false
        },
        city: {
          type: "string",
          optional: false
        },
        state: {
          type: "string",
          optional: false
        },
        country: {
          type: "string"
        },
        postcode: {
          type: "number",

          min: 4999,
          max: 6000
        }
      }
    }
  }
};

export const addressSchema1: Schema<Address> = {
  optional: false,
  type: "object",
  properties: {
    line1: {
      type: "string",
      optional: false
    },
    city: {
      type: "string",
      optional: false
    },
    state: {
      type: "string",
      optional: false
    },
    country: {
      type: "string"
    },
    postcode: {
      type: "number",

      min: 4999,
      max: 6000
    }
  }
};

export const customerSchema2: Schema<Customer> = {
  type: "object",
  optional: false,
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 24
    },
    sex: {
      type: "string",

      pattern: /male|female/
    },
    dob: {
      type: "date",
      optional: false
    },
    age: {
      type: "number",
      min: 0,
      max: 100
    },
    favouriteColors: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      optional: false,
      items: {
        type: "string",
        pattern: /(blue)|(green)/
      }
    },
    address: addressSchema1
  }
};
