import { Result } from "../models/result/Result";
import { Schema } from "../models/schema/Schema";
import { validate } from "../validate/validate";

enum AddressType {
  PoBox = "poBox",
  Street = "street",
}

type BaseAddress = {
  type: AddressType;
};

type PoBoxAddress = BaseAddress & {
  type: AddressType.PoBox;
  poBox: string;
};

type StreetAddress = BaseAddress & {
  type: AddressType.Street;
  street: string;
  city: string;
  state: string;
  zip: string;
};

type Address = PoBoxAddress | StreetAddress;

enum CustomerType {
  Personal = "personal",
  Business = "business",
}

// Basic Customer type
type BaseCustomer = {
  name: string;
  type: CustomerType;
};

// Discriminated Customer Types
type PersonalCustomer = BaseCustomer & {
  type: CustomerType.Personal;
  height: number;
  address: Address;
};

type BusinessCustomer = BaseCustomer & {
  type: CustomerType.Business;
  employeeCount: number;
};

type Customer = PersonalCustomer | BusinessCustomer;

const customerSchema: Schema<Customer> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 24,
    },
    type: {
      type: "string",
      values: Object.values(CustomerType),
    },
    height: {
      type: "number",
      min: 0.1,
      max: 7.5,
      isApplicableFn: ({ parent }) => {
        return parent.type === CustomerType.Personal;
      },
    },
    employeeCount: {
      type: "number",
      min: 0,
      isApplicableFn: ({ parent }) => {
        return parent.type === CustomerType.Business;
      },
    },
    address: {
      type: "object",
      isApplicableFn: ({ parent }: { parent: Customer }) => {
        return parent.type === CustomerType.Personal;
      },
      properties: {
        type: {
          type: "string",
          values: Object.values(AddressType),
        },
        poBox: {
          type: "string",
          isApplicableFn: ({ parent }) => {
            return parent.type === AddressType.PoBox;
          },
        },
        street: {
          type: "string",
          isApplicableFn: ({ parent }) => {
            return parent.type === AddressType.Street;
          },
        },
        city: {
          type: "string",
          isApplicableFn: ({ parent }) => {
            return parent.type === AddressType.Street;
          },
        },
        state: {
          type: "string",
          isApplicableFn: ({ parent }) => {
            return parent.type === AddressType.Street;
          },
        },
        zip: {
          type: "string",
          isApplicableFn: ({ parent }) => {
            return parent.type === AddressType.Street;
          },
        },
      },
    },
  },
};

test(`Personal customer validation`, () => {
  const personalCustomer: PersonalCustomer = {
    name: "John Smith",
    type: CustomerType.Personal,
    height: 5.9,
    address: {
      type: AddressType.Street,
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
    },
  };

  const result = validate(personalCustomer, customerSchema);
  expect(result.isValid).toBe(true);
});

test(`Business customer validation`, () => {
  const businessCustomer: BusinessCustomer = {
    name: "Acme Corp",
    type: CustomerType.Business,
    employeeCount: 150,
  };

  const result = validate(businessCustomer, customerSchema);
  expect(result.isValid).toBe(true);
});

test(`Invalid personal customer (missing address)`, () => {
  const invalidPersonalCustomer = {
    name: "John Smith",
    type: CustomerType.Personal,
    height: 5.9,
    // missing address
  };

  const result = validate(invalidPersonalCustomer, customerSchema as any);
  expect(result.isValid).toBe(false);
});
