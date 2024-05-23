export function ktdArrayRemoveItem<T>(
  array: T[],
  condition: (item: T) => boolean
) {
  const arrayCopy = [...array];
  const index = array.findIndex((item) => condition(item));
  if (index > -1) {
    arrayCopy.splice(index, 1);
  }
  return arrayCopy;
}
