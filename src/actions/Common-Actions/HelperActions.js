export const checkExistingValue = (array, key, value) => {
    return array.some((item) => item[key] === value);
  };
  