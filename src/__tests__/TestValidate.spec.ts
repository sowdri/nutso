import { Schema } from "../models/schema/Schema";
import { validate } from "../validate/validate";

test(`Test customer schema`, () => {
  interface Customer {
    name: string;
    address: Address;
  }
  interface Address {
    line1: string;
  }
  const customerSchema: Schema<Customer> = {
    type: "object",
    optional: false,
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24,
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string",
          },
        },
      },
    },
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview",
    },
  };
  expect(validate(customer, customerSchema)).toMatchSnapshot();
});

test(`Test index type`, () => {
  type Car = {
    vin: string;
  };

  interface Customer {
    name: string;
    address: Address;
    cars: {
      [key: string]: Car;
    };
  }
  interface Address {
    line1: string;
  }
  const customerSchema: Schema<Customer> = {
    type: "object",
    optional: false,
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24,
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string",
          },
        },
      },
      cars: {
        type: "object",
        properties: {
          rugby: {
            type: "object",
            properties: {
              vin: {
                type: "string",
              },
            },
          },
        },
      },
    },
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview",
    },
    cars: {
      rugby: {
        vin: "xsb797",
      },
    },
  };
  const result = validate(customer, customerSchema);
  expect(result).toMatchSnapshot();
});

test(`Test index type - required field - missing`, () => {
  type Car = {
    vin: string;
  };

  interface Customer {
    name: string;
    address: Address;
    cars: {
      [key: string]: Car;
    };
  }
  interface Address {
    line1: string;
  }
  const customerSchema: Schema<Customer> = {
    type: "object",
    optional: false,
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24,
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string",
          },
        },
      },
      cars: {
        type: "object",
        properties: {
          // not, it's rugby in the obj
          ruby: {
            type: "object",
            properties: {
              vin: {
                type: "string",
              },
            },
          },
        },
      },
    },
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview",
    },
    cars: {
      rugby: {
        vin: "xsb797",
      },
    },
  };
  const result = validate(customer, customerSchema);
  expect(result).toMatchSnapshot();
});

test(`Test index type - regex`, () => {
  type Car = {
    vin: string;
  };

  interface Customer {
    name: string;
    address: Address;
    cars: {
      [key: string]: Car;
    };
  }
  interface Address {
    line1: string;
  }
  const customerSchema: Schema<Customer> = {
    type: "object",
    optional: false,
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24,
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string",
          },
        },
      },
      cars: {
        type: "object",
        properties: {
          "/.*/": {
            type: "object",
            properties: {
              vin: {
                type: "string",
              },
            },
          },
        },
      },
    },
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview",
    },
    cars: {
      rugby: {
        vin: "xsb797",
      },
    },
  };
  const result = validate(customer, customerSchema);
  expect(result).toMatchSnapshot();
});

test(`Test index type - regex - 2`, () => {
  type Car = {
    vin: string;
  };

  interface Customer {
    name: string;
    address: Address;
    cars: {
      [key: string]: Car;
    };
  }
  interface Address {
    line1: string;
  }
  const customerSchema: Schema<Customer> = {
    type: "object",
    optional: false,
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24,
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string",
          },
        },
      },
      cars: {
        type: "object",
        properties: {
          "/ru.*/": {
            type: "object",
            properties: {
              vin: {
                type: "string",
              },
            },
          },
        },
      },
    },
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview",
    },
    cars: {
      buggy: {
        vin: "", // invalid, but not defined in schema
      },
      ruby: {
        vin: "", // invalid, defined in schema in regex /ru.*/
      },
      rugby: {
        vin: "xsb797",
      },
    },
  };
  const result = validate(customer, customerSchema);
  expect(result).toMatchSnapshot();
});

test(`Test index type - regex - index type is undefined`, () => {
  type Car = {
    vin: string;
  };

  interface Customer {
    name: string;
    cars?: {
      [key: string]: Car;
    };
  }

  const customerSchema: Schema<Customer> = {
    type: "object",
    optional: false,
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24,
      },
      cars: {
        type: "object",
        properties: {
          "/ru.*/": {
            type: "object",
            properties: {
              vin: {
                type: "string",
              },
            },
          },
        },
      },
    },
  };
  const customer: Customer = {
    name: "John",
  };
  const result = validate(customer, customerSchema);
  expect(result).toMatchSnapshot();
});

test(`Test optional flag - array - valid`, () => {
  type Colors = string[];
  type Person = {
    colors?: Colors;
    colorBlind: boolean;
  };
  const personSchema: Schema<Person> = {
    type: "object",
    properties: {
      colorBlind: {
        type: "boolean",
      },
      colors: {
        type: "array",
        optional: (person: Person) => {
          return person.colorBlind;
        },
        items: {
          type: "string",
        },
      },
    },
  };
  // valid
  const person: Person = {
    colorBlind: true,
  };
  const result = validate(person, personSchema);
  expect(result.isValid).toBeTruthy();
  // invalid
  const person2: Person = {
    colorBlind: false,
  };
  const result2 = validate(person2, personSchema);
  expect(result2.isValid).toBeFalsy();
});

test(`Test optional flag - boolean`, () => {
  type Person = {
    colorBlind: boolean;
    hasFavColor?: boolean;
  };
  const personSchema: Schema<Person> = {
    type: "object",
    properties: {
      colorBlind: {
        type: "boolean",
      },
      hasFavColor: {
        type: "boolean",
        optional: (person: Person) => person.colorBlind,
      },
    },
  };

  // valid
  const person1: Person = {
    colorBlind: true,
  };
  const result1 = validate(person1, personSchema);
  expect(result1.isValid).toBeTruthy();

  // invalid
  const person2: Person = {
    colorBlind: false,
  };
  const result2 = validate(person2, personSchema);
  expect(result2.isValid).toBeFalsy();
});

test(`Test optional flag - string`, () => {
  type Person = {
    colorBlind: boolean;
    favColor?: string;
  };
  const personSchema: Schema<Person> = {
    type: "object",
    properties: {
      colorBlind: {
        type: "boolean",
      },
      favColor: {
        type: "string",
        optional: (person: Person) => person.colorBlind,
      },
    },
  };

  // valid
  const person1: Person = {
    colorBlind: true,
  };
  const result1 = validate(person1, personSchema);
  expect(result1.isValid).toBeTruthy();

  // invalid
  const person2: Person = {
    colorBlind: false,
  };
  const result2 = validate(person2, personSchema);
  expect(result2.isValid).toBeFalsy();
});

test(`Test optional flag - string`, () => {
  type Person = {
    colorBlind: boolean;
    favColor?: string;
  };
  const personSchema: Schema<Person> = {
    type: "object",
    properties: {
      colorBlind: {
        type: "boolean",
      },
      favColor: {
        type: "string",
        optional: (person: Person) => person.colorBlind,
      },
    },
  };

  // valid
  const person1: Person = {
    colorBlind: true,
  };
  const result1 = validate(person1, personSchema);
  expect(result1.isValid).toBeTruthy();

  // invalid
  const person2: Person = {
    colorBlind: false,
  };
  const result2 = validate(person2, personSchema);
  expect(result2.isValid).toBeFalsy();
});

test(`Test optional flag - date`, () => {
  type Person = {
    isBorn: boolean;
    dob?: Date;
  };
  const personSchema: Schema<Person> = {
    type: "object",
    properties: {
      isBorn: {
        type: "boolean",
      },
      dob: {
        type: "date",
        optional: (person: Person) => person.isBorn,
      },
    },
  };

  // valid
  const person1: Person = {
    isBorn: true,
  };
  const result1 = validate(person1, personSchema);
  expect(result1.isValid).toBeTruthy();

  // invalid
  const person2: Person = {
    isBorn: false,
  };
  const result2 = validate(person2, personSchema);
  expect(result2.isValid).toBeFalsy();
});

test(`Test optional flag - number`, () => {
  type Person = {
    isBorn: boolean;
    weight?: number;
  };
  const personSchema: Schema<Person> = {
    type: "object",
    properties: {
      isBorn: {
        type: "boolean",
      },
      weight: {
        type: "number",
        optional: (person) => person.isBorn,
      },
    },
  };

  // valid
  const person1: Person = {
    isBorn: true,
  };
  const result1 = validate(person1, personSchema);
  expect(result1.isValid).toBeTruthy();

  // invalid
  const person2: Person = {
    isBorn: false,
  };
  const result2 = validate(person2, personSchema);
  expect(result2.isValid).toBeFalsy();
});

test(`Test optional flag - object`, () => {
  type Person = {
    isBorn: boolean;
    info?: {
      name: string;
      dob: Date;
    };
  };
  const personSchema: Schema<Person> = {
    type: "object",
    properties: {
      isBorn: {
        type: "boolean",
      },
      info: {
        type: "object",
        optional: (person: Person) => person.isBorn,
        properties: {
          name: {
            type: "string",
          },
          dob: {
            type: "date",
          },
        },
      },
    },
  };

  // valid
  const person1: Person = {
    isBorn: true,
  };
  const result1 = validate(person1, personSchema);
  expect(result1.isValid).toBeTruthy();

  // invalid
  const person2: Person = {
    isBorn: false,
  };
  const result2 = validate(person2, personSchema);
  expect(result2.isValid).toBeFalsy();
});
