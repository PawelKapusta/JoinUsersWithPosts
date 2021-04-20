/**
 * Counts elements in the array.
 * @param {Array<string>} array
 * @returns {Object<string, number>} An object where we have key and value which is number of key occurrences.
 */
const countElements = (array) => {
  return array.reduce(
    (acc, next) => ({
      ...acc,
      [next]: (acc[next] || 0) + 1,
    }),
    {},
  );
};
module.exports = {
  countElements: countElements,
};
