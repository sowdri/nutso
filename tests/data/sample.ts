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
  __required: false,
  name: {
    minLength: 3,
    maxLength: 24,
    required: true
  },
  sex: {
    required: true,
    regex: /male|female/
  },
  dob: {
    required: false
  },
  age: {
    min: 0,
    max: 100,
    required: true
  },
  favouriteColors: {
    minItems: 1,
    maxItems: 4,
    required: false,
    item: {
      regex: /(blue)|(green)/,
      required: true
    }
  },
  address: {
    __required: false,
    line1: {
      required: false
    },
    city: {
      required: false
    },
    state: {
      required: false
    },
    country: {
      required: true
    },
    postcode: {
      required: true,
      min: 4999,
      max: 6000
    }
  }
};

export const addressSchema1: Schema<Address> = {
  __required: false,
  line1: {
    required: false
  },
  city: {
    required: false
  },
  state: {
    required: false
  },
  country: {
    required: true
  },
  postcode: {
    required: true,
    min: 4999,
    max: 6000
  }
};

export const customerSchema2: Schema<Customer> = {
  __required: false,
  name: {
    minLength: 3,
    maxLength: 24,
    required: true
  },
  sex: {
    required: true,
    regex: /male|female/
  },
  dob: {
    required: false
  },
  age: {
    min: 0,
    max: 100,
    required: true
  },
  favouriteColors: {
    minItems: 1,
    maxItems: 4,
    required: false,
    item: {
      regex: /(blue)|(green)/,
      required: true
    }
  },
  address: addressSchema1
};
