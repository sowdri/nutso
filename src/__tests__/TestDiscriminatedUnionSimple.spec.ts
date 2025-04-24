import { Schema } from "..";
import { validate } from "../validate/validate";

/**
 * Test file for simple discriminated unions using shapes
 *
 * This example demonstrates how to use discriminated unions with the Schema validator
 * and how to use isApplicable to conditionally apply validation rules based on the
 * discriminator field (type).
 */

describe("Discriminated Union Tests", () => {
  // Define the types for our shape union
  type Circle = {
    type: "circle";
    radius: number;
  };

  type Rectangle = {
    type: "rectangle";
    width: number;
    height: number;
  };

  type Triangle = {
    type: "triangle";
    base: number;
    height: number;
  };

  // Define our Shape union type
  type Shape = Circle | Rectangle | Triangle;

  // Define the schema for our Shape union
  const shapeSchema: Schema<Shape> = {
    type: "object",
    properties: {
      // Common discriminator field
      type: { type: "string", values: ["circle", "rectangle", "triangle"] },

      // Circle-specific property
      radius: {
        type: "number",
        min: 0,
        isApplicableFn: ({ parent }) => parent.type === "circle",
      },

      // Rectangle-specific properties
      width: {
        type: "number",
        min: 0,
        isApplicableFn: ({ parent }) => parent.type === "rectangle",
      },
      height: {
        type: "number",
        min: 0,
        isApplicableFn: ({ parent }: { parent: Shape }) =>
          parent.type === "rectangle" || parent.type === "triangle",
      },

      // Triangle-specific properties
      base: {
        type: "number",
        min: 0,
        isApplicableFn: ({ parent }) => parent.type === "triangle",
      },
    },
  };

  test("validates a valid circle correctly", () => {
    const circle: Shape = { type: "circle", radius: 5 };
    const result = validate(circle, shapeSchema);
    expect(result.isValid).toBe(true);
  });

  test("validates a valid rectangle correctly", () => {
    const rectangle: Shape = { type: "rectangle", width: 10, height: 5 };
    const result = validate(rectangle, shapeSchema);
    expect(result.isValid).toBe(true);
  });

  test("validates a valid triangle correctly", () => {
    const triangle: Shape = { type: "triangle", base: 10, height: 5 };
    const result = validate(triangle, shapeSchema);
    expect(result.isValid).toBe(true);
  });

  test("fails for a circle with missing radius", () => {
    // Use 'any' type to workaround TypeScript checking for validation tests
    const invalidCircle: any = { type: "circle" };
    const result = validate(invalidCircle, shapeSchema);
    expect(result.isValid).toBe(false);
  });

  test("fails for a rectangle with negative dimensions", () => {
    const invalidRectangle: Shape = {
      type: "rectangle",
      width: -10,
      height: 5,
    };
    const result = validate(invalidRectangle, shapeSchema);
    expect(result.isValid).toBe(false);
  });

  test("fails when mixing shape properties", () => {
    // A circle shouldn't have width/height properties
    const mixedShape: any = { type: "circle", radius: 5, width: 10, height: 5 };
    const result = validate(mixedShape, shapeSchema);

    // This should still validate because the extra fields are not applicable to circles
    // The isApplicable function prevents validation of width/height for circles
    expect(result.isValid).toBe(true);
  });
});
