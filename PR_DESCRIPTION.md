# Remove Union Type

This PR removes the Union<T> type and all related functionality. The discriminated union validation now uses regular Schema<T> with isApplicableFn.

## Changes:

1. Removed src/models/Union.ts file which contained:

   - Union<T> type
   - AllKeys<T> type
   - CommonKeys<T> type
   - UniqueKeys<T> type

2. Updated imports and exports:

   - Removed Union export from index.ts
   - Removed Union import from validate.ts
   - Updated TestDiscriminatedUnionSimple.spec.ts to use Schema<T>

3. Updated documentation:
   - Removed Union type references from README.md
   - Updated discriminated union examples to use regular Schema<T>
   - Removed Union references from nutso-ai-guide.md
   - Updated comments in TestDiscriminatedUnionWithoutUnion.spec.ts

## Motivations:

- Simplify the API by using a single pattern for validating all types
- Reduce complexity in the type system
- Make the library more intuitive for users

## Testing:

- All existing tests pass
- Discriminated union validation continues to work with Schema<T>
