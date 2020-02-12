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

export const customerSchema1: Schema<Customer> = {
  type: "object",
  required: false,
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 24,
      required: true
    },
    sex: {
      type: "string",
      required: true,
      regex: /male|female/
    },
    dob: {
      type: "date",
      required: false
    },
    age: {
      type: "number",
      min: 0,
      max: 100,
      required: true
    },
    favouriteColors: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      required: false,
      item: {
        type: "string",
        regex: /(blue)|(green)/,
        required: true
      }
    },
    address: {
      type: "object",
      required: false,
      properties: {
        line1: {
          type: "string",
          required: false
        },
        city: {
          type: "string",
          required: false
        },
        state: {
          type: "string",
          required: false
        },
        country: {
          type: "string",
          required: true
        },
        postcode: {
          type: "number",
          required: true,
          min: 4999,
          max: 6000
        }
      }
    }
  }
};

export const addressSchema1: Schema<Address> = {
  required: false,
  type: "object",
  properties: {
    line1: {
      type: "string",
      required: false
    },
    city: {
      type: "string",
      required: false
    },
    state: {
      type: "string",
      required: false
    },
    country: {
      type: "string",
      required: true
    },
    postcode: {
      type: "number",
      required: true,
      min: 4999,
      max: 6000
    }
  }
};

export const customerSchema2: Schema<Customer> = {
  type: "object",
  required: false,
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 24,
      required: true
    },
    sex: {
      type: "string",
      required: true,
      regex: /male|female/
    },
    dob: {
      type: "date",
      required: false
    },
    age: {
      type: "number",
      min: 0,
      max: 100,
      required: true
    },
    favouriteColors: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      required: false,
      item: {
        type: "string",
        regex: /(blue)|(green)/,
        required: true
      }
    },
    address: addressSchema1
  }
};
