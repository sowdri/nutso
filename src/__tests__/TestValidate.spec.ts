import { Schema } from "../models/schema/Schema";
import { _validate, validate } from "../validate/validate";

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
        maxLength: 24
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string"
          }
        }
      }
    }
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview"
    }
  };
  expect(_validate(customer, customer, customerSchema)).toMatchSnapshot();
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
        maxLength: 24
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string"
          }
        }
      },
      cars: {
        type: "object",
        properties: {
          rugby: {
            type: "object",
            properties: {
              vin: {
                type: "string"
              }
            }
          }
        }
      }
    }
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview"
    },
    cars: {
      rugby: {
        vin: "xsb797"
      }
    }
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
        maxLength: 24
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string"
          }
        }
      },
      cars: {
        type: "object",
        properties: {
          // not, it's rugby in the obj
          ruby: {
            type: "object",
            properties: {
              vin: {
                type: "string"
              }
            }
          }
        }
      }
    }
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview"
    },
    cars: {
      rugby: {
        vin: "xsb797"
      }
    }
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
        maxLength: 24
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string"
          }
        }
      },
      cars: {
        type: "object",
        properties: {
          "/.*/": {
            type: "object",
            properties: {
              vin: {
                type: "string"
              }
            }
          }
        }
      }
    }
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview"
    },
    cars: {
      rugby: {
        vin: "xsb797"
      }
    }
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
        maxLength: 24
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string"
          }
        }
      },
      cars: {
        type: "object",
        properties: {
          "/ru.*/": {
            type: "object",
            properties: {
              vin: {
                type: "string"
              }
            }
          }
        }
      }
    }
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview"
    },
    cars: {
      buggy: {
        vin: "" // invalid, but not defined in schema
      },
      ruby: {
        vin: "" // invalid, defined in schema in regex /ru.*/
      },
      rugby: {
        vin: "xsb797"
      }
    }
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
        maxLength: 24
      },
      cars: {
        type: "object",
        properties: {
          "/ru.*/": {
            type: "object",
            properties: {
              vin: {
                type: "string"
              }
            }
          }
        }
      }
    }
  };
  const customer: Customer = {
    name: "John"
  };
  const result = validate(customer, customerSchema);
  expect(result).toMatchSnapshot();
});
