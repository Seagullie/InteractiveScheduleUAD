// checks whether index is not out of bounds and throws an error if it is
// TODO: deprecate maybe
export default function getStrict(array: Array<any>, index: number) {
  if (index >= array.length || index < 0) {
    throw new Error(`[Array Indexing] Index out of bounds: ${index} (length: ${array.length})`)
  }
  return array[index]
}
