import { Schema } from "..";
import { validate } from "../validate/validate";
import { ValidationFailure } from "../models/result/ValidationResult";
import { ObjectResult } from "../models/result/ObjectResult";

/**
 * Tests for the isApplicableFn functionality across different data types
 * and validation scenarios
 */

test(`isApplicableFn with primitive types`, () => {
  // Define a schema with conditional field applicability
  type UserSchema = {
    type: "user" | "admin";
    username: string;
    adminCode?: string;
  };

  const schema: Schema<UserSchema> = {
    type: "object",
    properties: {
      type: {
        type: "string",
        values: ["user", "admin"],
      },
      username: {
        type: "string",
        minLength: 3,
      },
      adminCode: {
        type: "string",
        minLength: 8,
        // Only applicable if type is 'admin'
        isApplicableFn: ({ parent }) => (parent as UserSchema).type === "admin",
      },
    },
  };

  // Test case 1: adminCode is required for admin users
  const adminUser = {
    type: "admin" as "admin",
    username: "admin1",
    adminCode: "1234", // This is too short but should fail validation
  };

  const adminResult = validate(adminUser, schema) as ObjectResult<UserSchema>;
  expect(adminResult.isValid).toBe(false);
  // Check if adminCode property exists and is invalid
  expect(adminResult.properties.adminCode?.isValid).toBe(false);
  expect(
    (adminResult.properties.adminCode as ValidationFailure)?.errorMessage
  ).toContain("at least 8");

  // Test case 2: adminCode is not required for regular users
  const regularUser = {
    type: "user" as "user",
    username: "user1",
    adminCode: "1234", // This is invalid but should be ignored
  };

  const userResult = validate(regularUser, schema) as ObjectResult<UserSchema>;
  expect(userResult.isValid).toBe(true);
  // Even though the adminCode is invalid, it should be considered valid
  // because it's not applicable for regular users
  expect(userResult.properties.adminCode?.isValid).toBe(true);
});

test(`isApplicableFn with nested objects`, () => {
  // Define a schema with conditional nested objects
  type PaymentInfo = {
    method: "credit" | "paypal";
    creditCard?: {
      number: string;
      expiry: string;
      cvv: string;
    };
    paypalEmail?: string;
  };

  const paymentSchema: Schema<PaymentInfo> = {
    type: "object",
    properties: {
      method: {
        type: "string",
        values: ["credit", "paypal"],
      },
      creditCard: {
        type: "object",
        // Only applicable if payment method is 'credit'
        isApplicableFn: ({ parent }) =>
          (parent as PaymentInfo).method === "credit",
        properties: {
          number: {
            type: "string",
            pattern: /^\d{16}$/, // 16 digits
          },
          expiry: {
            type: "string",
            pattern: /^\d{2}\/\d{2}$/, // MM/YY
          },
          cvv: {
            type: "string",
            pattern: /^\d{3}$/, // 3 digits
          },
        },
      },
      paypalEmail: {
        type: "string",
        // Only applicable if payment method is 'paypal'
        isApplicableFn: ({ parent }) =>
          (parent as PaymentInfo).method === "paypal",
        pattern: /^[\w\.-]+@[\w\.-]+\.\w+$/, // Email pattern
      },
    },
  };

  // Test case 1: Credit card payment with valid data
  const validCreditPayment: PaymentInfo = {
    method: "credit",
    creditCard: {
      number: "1234567890123456",
      expiry: "12/25",
      cvv: "123",
    },
    paypalEmail: "invalid-email", // Should be ignored for credit payment
  };

  const validCreditResult = validate(validCreditPayment, paymentSchema);
  expect(validCreditResult.isValid).toBe(true);
  expect(validCreditResult.properties.creditCard?.isValid).toBe(true);
  expect(validCreditResult.properties.paypalEmail?.isValid).toBe(true); // Ignored due to isApplicableFn

  // Test case 2: Credit card payment with invalid data
  const invalidCreditPayment: PaymentInfo = {
    method: "credit",
    creditCard: {
      number: "123", // Too short
      expiry: "invalid",
      cvv: "12345", // Too long
    },
  };

  const invalidCreditResult = validate(invalidCreditPayment, paymentSchema);
  expect(invalidCreditResult.isValid).toBe(false);
  expect(invalidCreditResult.properties.creditCard?.isValid).toBe(false);

  // Test case 3: PayPal payment with valid data
  const validPaypalPayment: PaymentInfo = {
    method: "paypal",
    paypalEmail: "test@example.com",
    creditCard: {
      // Should be ignored for PayPal payment
      number: "123",
      expiry: "invalid",
      cvv: "12345",
    },
  };

  const validPaypalResult = validate(validPaypalPayment, paymentSchema);
  expect(validPaypalResult.isValid).toBe(true);
  expect(validPaypalResult.properties.paypalEmail?.isValid).toBe(true);
  expect(validPaypalResult.properties.creditCard?.isValid).toBe(true); // Ignored due to isApplicableFn
});

test(`isApplicableFn with arrays`, () => {
  // Define a schema with conditional array validation
  type Survey = {
    includeComments: boolean;
    ratings: number[];
    comments?: string[];
  };

  const surveySchema: Schema<Survey> = {
    type: "object",
    properties: {
      includeComments: {
        type: "boolean",
      },
      ratings: {
        type: "array",
        items: {
          type: "number",
          min: 1,
          max: 5,
        },
      },
      comments: {
        type: "array",
        // Only applicable if includeComments is true
        isApplicableFn: ({ parent }) =>
          (parent as Survey).includeComments === true,
        items: {
          type: "string",
          minLength: 10, // Require substantial comments
        },
      },
    },
  };

  // Test case 1: Survey with comments enabled and valid data
  const validSurvey: Survey = {
    includeComments: true,
    ratings: [4, 5, 3],
    comments: [
      "This product is excellent",
      "Would recommend to others",
      "Good experience overall",
    ],
  };

  const validSurveyResult = validate(validSurvey, surveySchema);
  expect(validSurveyResult.isValid).toBe(true);
  expect(validSurveyResult.properties.comments?.isValid).toBe(true);

  // Test case 2: Survey with comments enabled but invalid comments
  const invalidSurvey: Survey = {
    includeComments: true,
    ratings: [4, 5, 3],
    comments: ["Too short", "OK", "Good"], // Comments are too short
  };

  const invalidSurveyResult = validate(invalidSurvey, surveySchema);
  expect(invalidSurveyResult.isValid).toBe(false);
  expect(invalidSurveyResult.properties.comments?.isValid).toBe(false);

  // Test case 3: Survey with comments disabled and invalid comments
  const commentsDisabledSurvey: Survey = {
    includeComments: false,
    ratings: [4, 5, 3],
    comments: ["Too short", "OK", "Good"], // Should be ignored
  };

  const commentsDisabledResult = validate(commentsDisabledSurvey, surveySchema);
  expect(commentsDisabledResult.isValid).toBe(true);
  expect(commentsDisabledResult.properties.comments?.isValid).toBe(true); // Ignored due to isApplicableFn
});

test(`isApplicableFn with root object reference`, () => {
  // Define a schema with field applicability based on the root object
  type FormWithDependencies = {
    stage: number;
    basicInfo: {
      name: string;
      email: string;
    };
    paymentInfo: {
      cardNumber: string;
      billingAddress: string;
    };
    confirmationInfo: {
      agreeToTerms: boolean;
    };
  };

  const formSchema: Schema<FormWithDependencies> = {
    type: "object",
    properties: {
      stage: {
        type: "number",
        min: 1,
        max: 3,
      },
      basicInfo: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
        },
      },
      paymentInfo: {
        type: "object",
        // Only applicable for stage 2 or above
        isApplicableFn: ({ root }) => (root as FormWithDependencies).stage >= 2,
        properties: {
          cardNumber: { type: "string", pattern: /^\d{16}$/ },
          billingAddress: { type: "string", minLength: 10 },
        },
      },
      confirmationInfo: {
        type: "object",
        // Only applicable for stage 3
        isApplicableFn: ({ root }) =>
          (root as FormWithDependencies).stage === 3,
        properties: {
          agreeToTerms: { type: "boolean" },
        },
      },
    },
  };

  // Test case 1: Form at stage 1 (only basic info should be validated)
  const stage1Form: FormWithDependencies = {
    stage: 1,
    basicInfo: {
      name: "John Doe",
      email: "john@example.com",
    },
    paymentInfo: {
      cardNumber: "invalid", // Should be ignored at this stage
      billingAddress: "short", // Should be ignored at this stage
    },
    confirmationInfo: {
      agreeToTerms: false, // Should be ignored at this stage
    },
  };

  const stage1Result = validate(stage1Form, formSchema);
  expect(stage1Result.isValid).toBe(true);
  expect(stage1Result.properties.paymentInfo?.isValid).toBe(true); // Ignored due to isApplicableFn
  expect(stage1Result.properties.confirmationInfo?.isValid).toBe(true); // Ignored due to isApplicableFn

  // Test case 2: Form at stage 2 (basic info and payment info should be validated)
  const stage2Form: FormWithDependencies = {
    stage: 2,
    basicInfo: {
      name: "John Doe",
      email: "john@example.com",
    },
    paymentInfo: {
      cardNumber: "invalid", // Should fail validation at this stage
      billingAddress: "short", // Should fail validation at this stage
    },
    confirmationInfo: {
      agreeToTerms: false, // Should be ignored at this stage
    },
  };

  const stage2Result = validate(stage2Form, formSchema);
  expect(stage2Result.isValid).toBe(false);
  expect(stage2Result.properties.paymentInfo?.isValid).toBe(false);
  expect(stage2Result.properties.confirmationInfo?.isValid).toBe(true); // Ignored due to isApplicableFn

  // Test case 3: Form at stage 3 (all fields should be validated)
  const stage3Form: FormWithDependencies = {
    stage: 3,
    basicInfo: {
      name: "John Doe",
      email: "john@example.com",
    },
    paymentInfo: {
      cardNumber: "1234567890123456", // Valid
      billingAddress: "123 Main St, City, Country", // Valid
    },
    confirmationInfo: {
      agreeToTerms: false, // Valid but might fail business logic
    },
  };

  const stage3Result = validate(stage3Form, formSchema);
  expect(stage3Result.isValid).toBe(true);
  expect(stage3Result.properties.paymentInfo?.isValid).toBe(true);
  expect(stage3Result.properties.confirmationInfo?.isValid).toBe(true);
});
