import { Schema } from "../models/schema/Schema";
import { validate } from "../validate/validate";
import { ValidationFailure } from "../models/result/ValidationResult";
import { emailValidationFn } from "../validation_functions/emailValidationFn";

describe("Email Validation Tests", () => {
  // Define the schema with email validation function
  type User = {
    email: string;
  };

  const userSchema: Schema<User> = {
    type: "object",
    properties: {
      email: {
        type: "string",
        validationFn: emailValidationFn,
      },
    },
  };

  test("Valid email addresses should pass validation", () => {
    const validEmails = [
      "test@example.com",
      "user.name@domain.com",
      "user+tag@example.co.uk",
      "user-name@domain.io",
      "user123@domain456.tech",
      "first.last@subdomain.example.com",
      "user_name@example.com",
      "user.name+tag@domain.co.jp",
    ];

    validEmails.forEach((email) => {
      const user: User = { email };
      const result = validate(user, userSchema);
      if (!result.isValid) {
        console.log(`Email that should be valid but fails: "${email}"`);
        console.log((result as ValidationFailure).errorMessage);
      }
      expect(result.isValid).toBe(true);
    });
  });

  test("Invalid email addresses should fail validation", () => {
    const invalidEmails = [
      "plainaddress",
      "@missingusername.com",
      "user@.com",
      "user@domain",
      "user@domain.",
      "user@.domain.com",
      "user@domain..com",
      "user@domain@domain.com",
      "user..name@domain.com",
      "user name@domain.com",
      "user@domain.c", // TLD too short
    ];

    invalidEmails.forEach((email) => {
      const user: User = { email };
      const result = validate(user, userSchema);
      if (result.isValid) {
        console.log(`Email that should be invalid but passes: "${email}"`);
      }
      expect(result.isValid).toBe(false);

      if (!result.isValid) {
        const failure = result as ValidationFailure;
        expect(failure.errorPath).toEqual(["email"]);
      }
    });
  });

  test("Empty email should fail validation", () => {
    const user: User = { email: "" };
    const result = validate(user, userSchema);
    expect(result.isValid).toBe(false);
  });

  test("Email with complex TLDs should pass validation", () => {
    const user: User = { email: "user@domain.travel" };
    const result = validate(user, userSchema);
    expect(result.isValid).toBe(true);
  });

  test("Email with subdomains should pass validation", () => {
    const user: User = { email: "user@sub.domain.co.uk" };
    const result = validate(user, userSchema);
    expect(result.isValid).toBe(true);
  });
});
