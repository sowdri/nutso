import { Schema } from "../models/schema/Schema";
import { _validate } from "../validate/validate";

interface Level1 {
  name: string;
  next: Level2;
}
interface Level2 {
  name: string;
  next: Level3;
}
interface Level3 {
  name: string;
  next: Level4;
}
interface Level4 {
  name: string;
}

test(`Test multi-level`, () => {
  const levelSchema: Schema<Level1> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24
      },
      next: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 24
          },
          next: {
            type: "object",
            properties: {
              name: {
                type: "string",
                minLength: 3,
                maxLength: 24
              },
              next: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    minLength: 3,
                    maxLength: 24
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  const level: Level1 = {} as any;
  expect(_validate(level, level, levelSchema)).toMatchSnapshot();
});
