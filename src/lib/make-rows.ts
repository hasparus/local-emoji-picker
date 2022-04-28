export const makeRows = <T>(values: Array<T>, rowLength = 8): T[][] => {
  return values.reduce((list: T[][], value, index) => {
    if (index % rowLength === 0) {
      return [...list, [value]];
    }

    const part = list[list.length - 1];
    list[list.length - 1] = [...part, value];
    return list;
  }, []);
};
