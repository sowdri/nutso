export const getKeys = <T extends {}>(o: T): Array<keyof T> => <Array<keyof T>>Object.keys(o);
