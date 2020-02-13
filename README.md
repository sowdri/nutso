# nutso 🦸🏼‍♂️

[![Build Status](https://travis-ci.com/sowdri/nutso.svg?branch=master)](https://travis-ci.com/sowdri/nutso)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](http://img.shields.io/npm/v/nutso.svg?style=flat)](https://npmjs.org/package/nutso "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

A typesafe validation library for typescript

# Objective

- Typesafe
- Simple
- Clean
- Unambigious
- Fast

# Concept

The idea behind this library is to create a schema from a typescript type. The schema should reflect the structure of the type and should be in sync with it. If the type changes the schema should be updated to reflect it.

Writing the `Schema` is super simple and there is just one 1 mandatory information for each field:

```
{
  type: 'number' | 'string' | 'date' | 'boolean' | 'array' | 'object'
}
```

Note: Even if the field is marked as an optional field in the interface, the type information is lost at runtime, so from the point of view of validation, the user has to still say if it's required or optional.

# Result

The result returned by `nutso` is also typesafe, meaning you will be able to access the validation result and the `errorMessage` in a type-safe way.

```
TODO
```
