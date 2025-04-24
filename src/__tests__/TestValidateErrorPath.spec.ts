import { Schema } from "../models/schema/Schema";
import { validate } from "../validate/validate";
import { ValidationFailure } from "../models/result/ValidationResult";

describe("Error Path Tests", () => {
  // Test basic object error paths
  test("Object property error path", () => {
    type User = {
      name: string;
      address: {
        street: string;
        city: string;
      };
    };

    const userSchema: Schema<User> = {
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: 3,
        },
        address: {
          type: "object",
          properties: {
            street: {
              type: "string",
              minLength: 5,
            },
            city: {
              type: "string",
              minLength: 2,
            },
          },
        },
      },
    };

    // Object with invalid street length
    const user: User = {
      name: "John",
      address: {
        street: "Elm", // Too short
        city: "New York",
      },
    };

    const result = validate(user, userSchema);
    expect(result.isValid).toBe(false);
    expect((result as ValidationFailure).errorPath).toEqual([
      "address",
      "street",
    ]);
  });

  // Test array error paths
  test("Array item error path", () => {
    type Task = {
      title: string;
      completed: boolean;
    };

    type TodoList = {
      name: string;
      tasks: Task[];
    };

    const todoListSchema: Schema<TodoList> = {
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: 3,
        },
        tasks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                minLength: 3,
              },
              completed: {
                type: "boolean",
              },
            },
          },
        },
      },
    };

    // List with invalid task title
    const todoList: TodoList = {
      name: "My Tasks",
      tasks: [
        { title: "Do laundry", completed: false },
        { title: "", completed: false }, // Empty title
        { title: "Clean house", completed: true },
      ],
    };

    const result = validate(todoList, todoListSchema);
    expect(result.isValid).toBe(false);
    expect((result as ValidationFailure).errorPath).toEqual([
      "tasks",
      "1",
      "title",
    ]);
  });

  // Test nested objects and arrays
  test("Deep nested error path", () => {
    type DeepNested = {
      level1: {
        level2: {
          level3: {
            items: Array<{
              name: string;
              value: number;
            }>;
          };
        };
      };
    };

    const deepNestedSchema: Schema<DeepNested> = {
      type: "object",
      properties: {
        level1: {
          type: "object",
          properties: {
            level2: {
              type: "object",
              properties: {
                level3: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            minLength: 2,
                          },
                          value: {
                            type: "number",
                            min: 0,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    // Deep nested object with invalid item
    const deepNested: DeepNested = {
      level1: {
        level2: {
          level3: {
            items: [
              { name: "Item 1", value: 10 },
              { name: "Item 2", value: -5 }, // Negative value
            ],
          },
        },
      },
    };

    const result = validate(deepNested, deepNestedSchema);
    expect(result.isValid).toBe(false);
    expect((result as ValidationFailure).errorPath).toEqual([
      "level1",
      "level2",
      "level3",
      "items",
      "1",
      "value",
    ]);
  });

  // Test date time range validation
  test("Date time range error path", () => {
    // Define the type for a date time range
    type DateTimeRange = {
      startIsoDateTimeUtc: string;
      endIsoDateTimeUtc: string;
    };

    // Create a schema with a custom validation function
    const dateTimeRangeSchema: Schema<DateTimeRange> = {
      type: "object",
      properties: {
        startIsoDateTimeUtc: {
          type: "string",
        },
        endIsoDateTimeUtc: {
          type: "string",
          validationFn: (args) => {
            const { value, parent } = args;
            const startTime = new Date(
              (parent as DateTimeRange).startIsoDateTimeUtc
            ).getTime();
            const endTime = new Date(value).getTime();

            if (endTime <= startTime) {
              return {
                errorMessage: "End time must be after start time",
              };
            }

            return;
          },
        },
      },
    };

    // Test case for same start and end time
    const sameTimeRange = {
      startIsoDateTimeUtc: "2023-01-01T10:00:00Z",
      endIsoDateTimeUtc: "2023-01-01T10:00:00Z", // Same time
    };

    const result1 = validate(sameTimeRange, dateTimeRangeSchema);
    expect(result1.isValid).toBe(false);

    // For error details, assert on the validation failure structure
    const failure1 = result1 as ValidationFailure;
    expect(failure1.errorMessage).toBe("End time must be after start time");
    expect(failure1.errorPath).toEqual(["endIsoDateTimeUtc"]);

    // Test with a valid date time range
    const validTimeRange = {
      startIsoDateTimeUtc: "2023-01-01T10:00:00Z",
      endIsoDateTimeUtc: "2023-01-01T11:00:00Z", // One hour later
    };

    const result2 = validate(validTimeRange, dateTimeRangeSchema);
    expect(result2.isValid).toBe(true);
  });
});
