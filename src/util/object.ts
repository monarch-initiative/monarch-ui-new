// for each object in array A, check if it exists in array B (matched by id
// field), and if so, merge the two together and include in results
export const merge = <T extends { id?: string }>(
  arrayA: Array<T>,
  arrayB: Array<T>
): Array<T> => {
  const result = [];
  for (const entryA of arrayA) {
    const entryB = arrayB.find((entryB) => entryA?.id === entryB?.id);
    if (entryB) result.push({ ...entryA, ...entryB });
  }
  return result;
};
