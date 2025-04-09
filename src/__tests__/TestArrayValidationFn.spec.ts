import { Schema } from "..";
import { validate } from "../validate/validate";

describe("Array ValidationFn Tests", () => {
  test("Array with valid validationFn", () => {
    type Colors = string[];

    const colorsSchema: Schema<Colors> = {
      type: "array",
      minItems: 3,
      maxItems: 10,
      items: {
        type: "string",
        minLength: 3,
      },
      validationFn: ({ value }) => {
        // Valid case - doesn't return anything
      },
    };

    const validColors: Colors = ["blue", "green", "black"];
    const result = validate(validColors, colorsSchema);

    expect(result.isValid).toBe(true);
    expect(result.items.length).toBe(3);
    expect(result.items[0].isValid).toBe(true);
  });

  test("Array with failing validationFn", () => {
    type Colors = string[];

    const colorsSchema: Schema<Colors> = {
      type: "array",
      minItems: 2,
      items: {
        type: "string",
      },
      validationFn: ({ value }) => {
        if (value.includes("red")) {
          return {
            errorMessage: "The color red is not allowed",
          };
        }
      },
    };

    const invalidColors: Colors = ["blue", "red", "green"];
    const result = validate(invalidColors, colorsSchema);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("The color red is not allowed");
    // Individual items should still be valid
    expect(result.items[0].isValid).toBe(true);
    expect(result.items[1].isValid).toBe(true);
  });

  test("Array with validationFn using root and parent context", () => {
    type ColorPreference = {
      favoriteColor: string;
      dislikedColors: string[];
    };

    const colorPreferenceSchema: Schema<ColorPreference> = {
      type: "object",
      properties: {
        favoriteColor: {
          type: "string",
        },
        dislikedColors: {
          type: "array",
          items: {
            type: "string",
          },
          validationFn: ({ value, root }) => {
            // Check that favorite color is not in disliked colors
            if (value.includes(root.favoriteColor)) {
              return {
                errorMessage:
                  "Disliked colors cannot include the favorite color",
              };
            }
          },
        },
      },
    };

    // Invalid case: favorite color is also in disliked colors
    const invalidPreference: ColorPreference = {
      favoriteColor: "blue",
      dislikedColors: ["red", "blue", "green"],
    };

    const invalidResult = validate(invalidPreference, colorPreferenceSchema);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.properties.dislikedColors.isValid).toBe(false);
    expect(invalidResult.properties.dislikedColors.errorMessage).toBe(
      "Disliked colors cannot include the favorite color"
    );

    // Valid case: favorite color is not in disliked colors
    const validPreference: ColorPreference = {
      favoriteColor: "blue",
      dislikedColors: ["red", "green", "yellow"],
    };

    const validResult = validate(validPreference, colorPreferenceSchema);
    expect(validResult.isValid).toBe(true);
    expect(validResult.properties.dislikedColors.isValid).toBe(true);
  });

  test("Array with validationFn after item validation failure", () => {
    type Numbers = number[];

    const numbersSchema: Schema<Numbers> = {
      type: "array",
      items: {
        type: "number",
        min: 0, // All numbers must be positive
      },
      validationFn: ({ value }) => {
        // This should not be called if any item fails validation
        if (value.length > 5) {
          return {
            errorMessage: "Array cannot have more than 5 items",
          };
        }
      },
    };

    // Array with a negative number (invalid item)
    const invalidNumbers: Numbers = [1, 2, -3, 4];
    const result = validate(invalidNumbers, numbersSchema);

    expect(result.isValid).toBe(false);
    // The error should be about the negative number, not the array length
    expect(result.errorMessage).not.toBe("Array cannot have more than 5 items");
    expect(result.items[2].isValid).toBe(false);
  });

  test("Empty array with validationFn", () => {
    type EmptyArrayTest = any[];

    const emptyArraySchema: Schema<EmptyArrayTest> = {
      type: "array",
      minItems: 0,
      items: {
        type: "string",
      },
      validationFn: ({ value }) => {
        // Empty arrays are not allowed in this case
        if (value.length === 0) {
          return {
            errorMessage: "Array cannot be empty",
          };
        }
      },
    };

    const emptyArray: EmptyArrayTest = [];
    const result = validate(emptyArray, emptyArraySchema);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Array cannot be empty");
  });

  test("Array validationFn with simple error message", () => {
    type Team = {
      name: string;
      members: string[];
    };

    const teamSchema: Schema<Team> = {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        members: {
          type: "array",
          items: {
            type: "string",
          },
          validationFn: ({ value }) => {
            if (!value.includes("leader")) {
              return {
                errorMessage: "Team must include a leader",
              };
            }
          },
        },
      },
    };

    const teamWithoutLeader: Team = {
      name: "My Team",
      members: ["member1", "member2", "member3"],
    };

    const result = validate(teamWithoutLeader, teamSchema);
    expect(result.isValid).toBe(false);
    expect(result.properties.members.errorMessage).toBe(
      "Team must include a leader"
    );
    // Error path should be path to the property with the validation error
    expect(result.errorPath).toEqual(["members"]);
  });
});
