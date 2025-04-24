import { ValidationFn } from "../models/ValidationFn";

/**
 * A validation function for email addresses that follows standard email format rules.
 * This validator checks:
 *
 * 1. Basic structure (presence of @ symbol)
 * 2. Local part (username) validation:
 *    - No empty username
 *    - No consecutive dots
 *    - No spaces
 *    - Valid characters only (a-zA-Z0-9._%+-)
 * 3. Domain part validation:
 *    - No empty domain
 *    - No leading or trailing dots
 *    - No consecutive dots
 *    - Domain must include at least one dot
 *    - TLD must be at least 2 characters
 *    - Valid domain format
 *
 * @example
 * ```ts
 * const schema: Schema<{ email: string }> = {
 *   type: "object",
 *   properties: {
 *     email: {
 *       type: "string",
 *       validationFn: emailValidationFn
 *     }
 *   }
 * };
 * ```
 *
 * See src/__tests__/TestEmailValidation.spec.ts for more usage examples.
 */
export const emailValidationFn: ValidationFn<string> = (args) => {
  const { value } = args;
  if (typeof value !== "string") {
    return { errorMessage: "Email must be a string" };
  }

  // Empty check is already handled by the string validator
  if (value === "") return;

  // Check for basic structure (something @ something)
  if (!value.includes("@")) {
    return { errorMessage: "Email must contain an @ symbol" };
  }

  const [localPart, domainPart] = value.split("@");

  // Local part validations
  if (!localPart || localPart.length === 0) {
    return { errorMessage: "Email username cannot be empty" };
  }
  if (localPart.includes("..")) {
    return { errorMessage: "Email cannot contain consecutive dots" };
  }
  if (localPart.includes(" ")) {
    return { errorMessage: "Email cannot contain spaces" };
  }
  if (!/^[a-zA-Z0-9._%+-]+$/.test(localPart)) {
    return { errorMessage: "Email username contains invalid characters" };
  }

  // Domain part validations
  if (!domainPart || domainPart.length === 0) {
    return { errorMessage: "Email domain cannot be empty" };
  }
  if (domainPart.startsWith(".") || domainPart.endsWith(".")) {
    return { errorMessage: "Email domain cannot start or end with a dot" };
  }
  if (domainPart.includes("..")) {
    return { errorMessage: "Email domain cannot contain consecutive dots" };
  }
  if (!domainPart.includes(".")) {
    return { errorMessage: "Email domain must include at least one dot" };
  }
  const tld = domainPart.split(".").pop() || "";
  if (tld.length < 2) {
    return { errorMessage: "Email TLD must be at least 2 characters" };
  }
  if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domainPart)) {
    return { errorMessage: "Email domain is invalid" };
  }

  // All checks passed
  return;
};
