# nutso

![Build Status](https://travis-ci.com/sowdri/nutso.svg?branch=master)

A typesafe validation library for typescript

# Objective

- Typesafe
- Simple
- Clean
- Unambigious
- Fast

# Concept

The idea behind this library is to create a schema from a typescript type. The schema should reflect the structure of the type and should be in sync with it. If the type changes the schema should be updated to reflect it. So every field in the parent type will have an entry in the schema.

There are 2 mandatory information for each field:

```
{
  type: 'number' | 'string' | 'date' | 'boolean' | 'array' | 'object',
  required: boolean
}
```

Note: Even if the field is marked as an optional field in the interface, the type information is lost at runtime, so from the point of view of validation, the user has to still say if it's required or optional.

# Result

The result returned by `nutso` is also typesafe, meaning you will be able to access the validation result and the `errorMessage` in a type-safe way.

```
TODO
```
