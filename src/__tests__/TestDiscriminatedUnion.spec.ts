import { Schema } from "..";
import { validate } from "../validate/validate";

/**
 * Test file for multi-level discriminated unions
 *
 * Structure:
 * 1. First level: Payment method (Credit Card, PayPal, Bank Transfer)
 * 2. Second level:
 *    - For Credit Cards: Card type (Visa, Mastercard, Amex)
 *    - For PayPal: Account type (Personal, Business)
 *    - For Bank Transfer: Transfer type (Domestic, International)
 * 3. Third level:
 *    - For International Bank Transfers: Region (Europe, Asia, Americas)
 *    - For Amex: Card tier (Standard, Gold, Platinum)
 */

describe("Discriminated Union Tests", () => {
  // Define the types
  type CreditCardVisa = {
    method: "creditCard";
    cardType: "visa";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
  };

  type CreditCardMastercard = {
    method: "creditCard";
    cardType: "mastercard";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
  };

  type CreditCardAmexStandard = {
    method: "creditCard";
    cardType: "amex";
    tier: "standard";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
  };

  type CreditCardAmexGold = {
    method: "creditCard";
    cardType: "amex";
    tier: "gold";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
    membershipPoints: number;
  };

  type CreditCardAmexPlatinum = {
    method: "creditCard";
    cardType: "amex";
    tier: "platinum";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
    membershipPoints: number;
    conciergePhone: string;
  };

  type PayPalPersonal = {
    method: "paypal";
    accountType: "personal";
    email: string;
    phone?: string;
  };

  type PayPalBusiness = {
    method: "paypal";
    accountType: "business";
    email: string;
    businessName: string;
    taxId: string;
  };

  type BankTransferDomestic = {
    method: "bankTransfer";
    transferType: "domestic";
    accountNumber: string;
    routingNumber: string;
    accountName: string;
  };

  type BankTransferInternationalEurope = {
    method: "bankTransfer";
    transferType: "international";
    region: "europe";
    iban: string;
    swiftCode: string;
    accountName: string;
    bankName: string;
  };

  type BankTransferInternationalAsia = {
    method: "bankTransfer";
    transferType: "international";
    region: "asia";
    accountNumber: string;
    swiftCode: string;
    accountName: string;
    bankName: string;
    intermediaryBank?: string;
  };

  type BankTransferInternationalAmericas = {
    method: "bankTransfer";
    transferType: "international";
    region: "americas";
    accountNumber: string;
    routingNumber: string;
    accountName: string;
    bankName: string;
  };

  // Combined union type
  type PaymentMethod =
    | CreditCardVisa
    | CreditCardMastercard
    | CreditCardAmexStandard
    | CreditCardAmexGold
    | CreditCardAmexPlatinum
    | PayPalPersonal
    | PayPalBusiness
    | BankTransferDomestic
    | BankTransferInternationalEurope
    | BankTransferInternationalAsia
    | BankTransferInternationalAmericas;

  // Create the schema
  const paymentMethodSchema: Schema<PaymentMethod> = {
    type: "object",
    properties: {
      // Common first-level discriminator
      method: {
        type: "string",
        values: ["creditCard", "paypal", "bankTransfer"],
      },

      // Credit Card specific properties
      cardType: {
        type: "string",
        values: ["visa", "mastercard", "amex"],
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "creditCard",
      },
      cardNumber: {
        type: "string",
        pattern: /^\d{16}$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "creditCard",
      },
      expiryDate: {
        type: "string",
        pattern: /^\d{2}\/\d{2}$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "creditCard",
      },
      cvv: {
        type: "string",
        pattern: /^\d{3,4}$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "creditCard",
      },
      billingAddress: {
        type: "string",
        minLength: 10,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "creditCard",
      },

      // Amex specific properties (third level)
      tier: {
        type: "string",
        values: ["standard", "gold", "platinum"],
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "creditCard" && (parent as any).cardType === "amex",
      },
      membershipPoints: {
        type: "number",
        min: 0,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "creditCard" &&
          (parent as any).cardType === "amex" &&
          ((parent as any).tier === "gold" ||
            (parent as any).tier === "platinum"),
      },
      conciergePhone: {
        type: "string",
        pattern: /^\+\d{10,15}$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "creditCard" &&
          (parent as any).cardType === "amex" &&
          (parent as any).tier === "platinum",
      },

      // PayPal specific properties
      accountType: {
        type: "string",
        values: ["personal", "business"],
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "paypal",
      },
      email: {
        type: "string",
        pattern: /^[\w\.-]+@[\w\.-]+\.\w+$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "paypal",
      },
      phone: {
        type: "string",
        pattern: /^\+\d{10,15}$/,
        optional: true,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "paypal" &&
          (parent as any).accountType === "personal",
      },
      businessName: {
        type: "string",
        minLength: 2,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "paypal" &&
          (parent as any).accountType === "business",
      },
      taxId: {
        type: "string",
        pattern: /^[A-Z0-9\-]{5,20}$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "paypal" &&
          (parent as any).accountType === "business",
      },

      // Bank Transfer specific properties
      transferType: {
        type: "string",
        values: ["domestic", "international"],
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "bankTransfer",
      },
      accountNumber: {
        type: "string",
        pattern: /^\d{8,17}$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          (parent.method === "bankTransfer" &&
            (parent as any).transferType === "domestic") ||
          (parent.method === "bankTransfer" &&
            (parent as any).transferType === "international" &&
            ((parent as any).region === "asia" ||
              (parent as any).region === "americas")),
      },
      routingNumber: {
        type: "string",
        pattern: /^\d{9}$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          (parent.method === "bankTransfer" &&
            (parent as any).transferType === "domestic") ||
          (parent.method === "bankTransfer" &&
            (parent as any).transferType === "international" &&
            (parent as any).region === "americas"),
      },
      accountName: {
        type: "string",
        minLength: 2,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "bankTransfer",
      },

      // International Bank Transfer properties
      region: {
        type: "string",
        values: ["europe", "asia", "americas"],
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "bankTransfer" &&
          (parent as any).transferType === "international",
      },
      iban: {
        type: "string",
        pattern: /^[A-Z]{2}\d{2}[A-Z0-9]{12,30}$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "bankTransfer" &&
          (parent as any).transferType === "international" &&
          (parent as any).region === "europe",
      },
      swiftCode: {
        type: "string",
        pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "bankTransfer" &&
          (parent as any).transferType === "international" &&
          ((parent as any).region === "europe" ||
            (parent as any).region === "asia"),
      },
      bankName: {
        type: "string",
        minLength: 2,
        isApplicableFn: ({ parent }: { parent: PaymentMethod }) =>
          parent.method === "bankTransfer" &&
          (parent as any).transferType === "international",
      },
      intermediaryBank: {
        type: "string",
        optional: true,
        isApplicableFn: ({ parent }) =>
          parent.method === "bankTransfer" &&
          (parent as any).transferType === "international" &&
          (parent as any).region === "asia",
      },
    },
  };

  // Test cases
  test("Visa Credit Card Validation", () => {
    const visaPayment: CreditCardVisa = {
      method: "creditCard",
      cardType: "visa",
      cardNumber: "4111111111111111",
      expiryDate: "12/25",
      cvv: "123",
      billingAddress: "123 Main St, City, Country",
    };

    const result = validate(visaPayment, paymentMethodSchema);
    expect(result.isValid).toBe(true);
  });

  test("Amex Platinum Credit Card Validation", () => {
    const amexPlatinumPayment: CreditCardAmexPlatinum = {
      method: "creditCard",
      cardType: "amex",
      tier: "platinum",
      cardNumber: "3782822463100005",
      expiryDate: "12/25",
      cvv: "1234",
      billingAddress: "123 Main St, City, Country",
      membershipPoints: 50000,
      conciergePhone: "+12345678901",
    };

    const result = validate(amexPlatinumPayment, paymentMethodSchema);
    expect(result.isValid).toBe(true);
  });

  test("PayPal Business Account Validation", () => {
    const paypalBusinessPayment: PayPalBusiness = {
      method: "paypal",
      accountType: "business",
      email: "business@example.com",
      businessName: "Example Business",
      taxId: "AB123-45678",
    };

    const result = validate(paypalBusinessPayment, paymentMethodSchema);
    expect(result.isValid).toBe(true);
  });

  test("International Bank Transfer (Europe) Validation", () => {
    const europeBankTransfer: BankTransferInternationalEurope = {
      method: "bankTransfer",
      transferType: "international",
      region: "europe",
      iban: "DE89370400440532013000",
      swiftCode: "DEUTDEFF",
      accountName: "Example Account",
      bankName: "Deutsche Bank",
    };

    const result = validate(europeBankTransfer, paymentMethodSchema);
    expect(result.isValid).toBe(true);
  });

  test("International Bank Transfer (Asia) Validation", () => {
    const asiaBankTransfer: BankTransferInternationalAsia = {
      method: "bankTransfer",
      transferType: "international",
      region: "asia",
      accountNumber: "1234567890123",
      swiftCode: "ICICINBB",
      accountName: "Example Account",
      bankName: "ICICI Bank",
      intermediaryBank: "Citibank",
    };

    const result = validate(asiaBankTransfer, paymentMethodSchema);
    expect(result.isValid).toBe(true);
  });

  test("Invalid Credit Card Number", () => {
    const invalidVisaPayment: CreditCardVisa = {
      method: "creditCard",
      cardType: "visa",
      cardNumber: "411", // Invalid - too short
      expiryDate: "12/25",
      cvv: "123",
      billingAddress: "123 Main St, City, Country",
    };

    const result = validate(invalidVisaPayment, paymentMethodSchema);
    expect(result.isValid).toBe(false);
    // Type assertion for accessing properties safely
    expect((result.properties as any).cardNumber.isValid).toBe(false);
  });

  test("Missing Amex Platinum Required Field", () => {
    // Create Amex Platinum without the required conciergePhone
    const incompleteAmexPlatinum = {
      method: "creditCard" as const,
      cardType: "amex" as const,
      tier: "platinum" as const,
      cardNumber: "3782822463100005",
      expiryDate: "12/25",
      cvv: "1234",
      billingAddress: "123 Main St, City, Country",
      membershipPoints: 50000,
      // conciergePhone is missing
    };

    const result = validate(incompleteAmexPlatinum, paymentMethodSchema as any);
    expect(result.isValid).toBe(false);
    // Type assertion for accessing properties safely
    expect((result.properties as any).conciergePhone.isValid).toBe(false);
  });

  test("Fields from wrong branch are ignored", () => {
    // This is a PayPal payment but with credit card fields
    const mixedPayment = {
      method: "paypal" as const,
      accountType: "personal" as const,
      email: "person@example.com",
      // These fields shouldn't be validated because they're not applicable for PayPal
      cardNumber: "invalid",
      expiryDate: "invalid",
      cvv: "invalid",
    };

    const result = validate(mixedPayment, paymentMethodSchema as any);
    expect(result.isValid).toBe(true);
    // Type assertion for accessing properties safely - using optional chaining with type assertion
    expect((result.properties as any).cardNumber?.isValid).not.toBe(false);
    expect((result.properties as any).expiryDate?.isValid).not.toBe(false);
    expect((result.properties as any).cvv?.isValid).not.toBe(false);
  });
});
