import { Schema } from "../models/schema/Schema";
import { validate } from "../validate/validate";
import { ValidationFailure } from "../models/result/ValidationResult";

describe("Object minProperties and maxProperties Tests", () => {
  test("Dynamic configuration map with minProperties and maxProperties", () => {
    type ConfigMap = Record<string, string>;

    const configMapSchema: Schema<ConfigMap> = {
      type: "object",
      minProperties: 1,
      maxProperties: 5,
      properties: {
        "^.*$": {
          type: "string",
        },
      },
    };

    // Valid: 3 properties (within range)
    const validConfig: ConfigMap = {
      host: "localhost",
      port: "3000",
      debug: "true",
    };

    const result = validate(validConfig, configMapSchema);
    expect(result.isValid).toBe(true);
  });

  test("Feature flags with property count constraints", () => {
    type FeatureFlags = Record<string, boolean>;

    const featureFlagsSchema: Schema<FeatureFlags> = {
      type: "object",
      minProperties: 1,
      maxProperties: 10,
      properties: {
        "^[a-zA-Z][a-zA-Z0-9_]*$": {
          type: "boolean",
        },
      },
    };

    // Valid: Has feature flags within limits
    const validFlags: FeatureFlags = {
      enableNewUI: true,
      enableBetaFeatures: false,
      enableAnalytics: true,
    };

    const validResult = validate(validFlags, featureFlagsSchema);
    expect(validResult.isValid).toBe(true);

    // Invalid: Empty object (below minimum)
    const emptyFlags: FeatureFlags = {};

    const emptyResult = validate(emptyFlags, featureFlagsSchema);
    expect(emptyResult.isValid).toBe(false);
    expect((emptyResult as ValidationFailure).errorMessage).toBe(
      "Should have at least 1 properties."
    );
  });

  test("User preferences with flexible structure", () => {
    type UserPreferences = {
      theme?: "light" | "dark";
      language?: string;
      [key: string]: any;
    };

    const userPreferencesSchema: Schema<UserPreferences> = {
      type: "object",
      minProperties: 1,
      maxProperties: 20,
      properties: {
        theme: {
          type: "string",
          values: ["light", "dark"],
          optional: true,
        },
        language: {
          type: "string",
          optional: true,
        },
        "^(?!theme|language).*$": {
          type: "string",
        },
      },
    };

    // Valid: Has required minimum properties
    const validPrefs: UserPreferences = {
      theme: "dark",
      customSetting1: "value1",
      customSetting2: "value2",
    };

    const validResult = validate(validPrefs, userPreferencesSchema);
    expect(validResult.isValid).toBe(true);

    // Invalid: Empty preferences (below minimum)
    const emptyPrefs: UserPreferences = {};

    const emptyResult = validate(emptyPrefs, userPreferencesSchema);
    expect(emptyResult.isValid).toBe(false);
    expect((emptyResult as ValidationFailure).errorMessage).toBe(
      "Should have at least 1 properties."
    );
  });

  test("API response metadata with property limits", () => {
    type ApiMetadata = Record<string, string | number>;

    const metadataSchema: Schema<ApiMetadata> = {
      type: "object",
      minProperties: 0, // Metadata is optional
      maxProperties: 15, // Prevent excessive metadata
      properties: {
        "^.*$": {
          type: "string", // Simplified for test - in reality might be union type
        },
      },
    };

    // Valid: Within limits
    const validMetadata: ApiMetadata = {
      requestId: "req-123",
      timestamp: "2023-01-01T00:00:00Z",
      version: "1.0",
    };

    const validResult = validate(validMetadata, metadataSchema);
    expect(validResult.isValid).toBe(true);

    // Valid: Empty metadata (minProperties is 0)
    const emptyMetadata: ApiMetadata = {};

    const emptyResult = validate(emptyMetadata, metadataSchema);
    expect(emptyResult.isValid).toBe(true);

    // Invalid: Too many properties
    const excessiveMetadata: ApiMetadata = {};
    for (let i = 0; i < 20; i++) {
      excessiveMetadata[`key${i}`] = `value${i}`;
    }

    const excessiveResult = validate(excessiveMetadata, metadataSchema);
    expect(excessiveResult.isValid).toBe(false);
    expect((excessiveResult as ValidationFailure).errorMessage).toBe(
      "Should not have more than 15 properties."
    );
  });

  test("Object with valid number of properties", () => {
    type Person = {
      name: string;
      age: number;
      email: string;
    };

    const personSchema: Schema<Person> = {
      type: "object",
      minProperties: 2,
      maxProperties: 5,
      properties: {
        name: {
          type: "string",
        },
        age: {
          type: "number",
        },
        email: {
          type: "string",
        },
      },
    };

    const validPerson: Person = {
      name: "John",
      age: 30,
      email: "john@example.com",
    };

    const result = validate(validPerson, personSchema);
    expect(result.isValid).toBe(true);
  });

  test("Object with too few properties (minProperties violation)", () => {
    type Person = {
      name?: string;
      age?: number;
      email?: string;
    };

    const personSchema: Schema<Person> = {
      type: "object",
      minProperties: 3,
      properties: {
        name: {
          type: "string",
          optional: true,
        },
        age: {
          type: "number",
          optional: true,
        },
        email: {
          type: "string",
          optional: true,
        },
      },
    };

    // Object with only 2 properties, but minProperties is 3
    const invalidPerson: Person = {
      name: "John",
      age: 30,
    };

    const result = validate(invalidPerson, personSchema);
    expect(result.isValid).toBe(false);
    expect((result as ValidationFailure).errorMessage).toBe(
      "Should have at least 3 properties."
    );
    expect((result as ValidationFailure).errorPath).toEqual([]);
  });

  test("Object with too many properties (maxProperties violation)", () => {
    type Person = {
      name: string;
      age: number;
      email: string;
      phone: string;
      address: string;
    };

    const personSchema: Schema<Person> = {
      type: "object",
      maxProperties: 3,
      properties: {
        name: {
          type: "string",
        },
        age: {
          type: "number",
        },
        email: {
          type: "string",
        },
        phone: {
          type: "string",
        },
        address: {
          type: "string",
        },
      },
    };

    // Object with 5 properties, but maxProperties is 3
    const invalidPerson: Person = {
      name: "John",
      age: 30,
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
    };

    const result = validate(invalidPerson, personSchema);
    expect(result.isValid).toBe(false);
    expect((result as ValidationFailure).errorMessage).toBe(
      "Should not have more than 3 properties."
    );
    expect((result as ValidationFailure).errorPath).toEqual([]);
  });

  test("Empty object with minProperties", () => {
    type EmptyObject = {};

    const emptyObjectSchema: Schema<EmptyObject> = {
      type: "object",
      minProperties: 1,
      properties: {},
    };

    const emptyObj: EmptyObject = {};

    const result = validate(emptyObj, emptyObjectSchema);
    expect(result.isValid).toBe(false);
    expect((result as ValidationFailure).errorMessage).toBe(
      "Should have at least 1 properties."
    );
  });

  test("minProperties and maxProperties with property validation failure", () => {
    type Person = {
      name: string;
      age: number;
    };

    const personSchema: Schema<Person> = {
      type: "object",
      minProperties: 2,
      maxProperties: 2,
      properties: {
        name: {
          type: "string",
          minLength: 3,
        },
        age: {
          type: "number",
          min: 0,
        },
      },
    };

    // Object has correct number of properties but invalid property value
    const invalidPerson: Person = {
      name: "Jo", // Too short
      age: 25,
    };

    const result = validate(invalidPerson, personSchema);
    expect(result.isValid).toBe(false);
    // Should fail on property validation, not property count
    expect((result as ValidationFailure).errorMessage).toBe(
      "Should be at least 3 characters."
    );
    expect((result as ValidationFailure).errorPath).toEqual(["name"]);
  });

  test("Object with validationFn and property count validation", () => {
    type UserPreferences = {
      theme?: string;
      language?: string;
      notifications?: boolean;
    };

    const userPreferencesSchema: Schema<UserPreferences> = {
      type: "object",
      minProperties: 1,
      properties: {
        theme: {
          type: "string",
          optional: true,
        },
        language: {
          type: "string",
          optional: true,
        },
        notifications: {
          type: "boolean",
          optional: true,
        },
      },
      validationFn: ({ value }) => {
        // Custom validation that requires theme if notifications are enabled
        if (value.notifications && !value.theme) {
          return {
            errorMessage: "Theme is required when notifications are enabled",
          };
        }
      },
    };

    // Valid: meets minProperties and custom validation
    const validPreferences: UserPreferences = {
      theme: "dark",
      notifications: true,
    };

    const validResult = validate(validPreferences, userPreferencesSchema);
    expect(validResult.isValid).toBe(true);

    // Invalid: fails custom validation but meets property count
    const invalidPreferences: UserPreferences = {
      notifications: true, // Missing theme
    };

    const invalidResult = validate(invalidPreferences, userPreferencesSchema);
    expect(invalidResult.isValid).toBe(false);
    expect((invalidResult as ValidationFailure).errorMessage).toBe(
      "Theme is required when notifications are enabled"
    );
  });
});
