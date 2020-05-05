// utility to check a type
export const isNil = (o: any): o is undefined | null => {
  if (o === undefined || o === null) return true;
  return false;
};

export const isString = (o: any) => {
  if (isNil(o)) return false;
  if (typeof o === "string") return true;
  return false;
};

export const isNumber = (o: any) => {
  if (isNil(o)) return false;
  if (typeof o === "number") return true;
  return false;
};

export const isDate = (o: any): o is Date => {
  if (isNil(o)) return false;
  if (o instanceof Date) return true;
  return false;
};

export const isBoolean = (o: any) => {
  if (isNil(o)) return false;
  if (typeof o === "boolean") return true;
  return false;
};

export const isArray = (o: any) => {
  if (isNil(o)) return false;
  if (o instanceof Array) return true;
  return false;
};

export const isObject = (o: any) => {
  if (isNil(o)) return false;
  if (o instanceof Object) return true;
  return false;
};
