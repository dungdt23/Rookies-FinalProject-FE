// utils.ts

export const removeUndefinedValues = <T extends Record<string, any>>(obj: T): void => {
  Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});
};
