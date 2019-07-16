interface ArrayDifferenceResult<T> {
  toAdd: T[];
  toRemove: T[];
  remaining: T[];
}

export function getArrayDifferences<T>(
  oldArray: T[],
  newArray: T[]
): ArrayDifferenceResult<T> {
  const toAdd = newArray.filter(newItem => !oldArray.includes(newItem));
  const toRemove = oldArray.filter(oldItem => !newArray.includes(oldItem));
  const remaining = newArray.filter(newItem => oldArray.includes(newItem));
  return {
    toAdd,
    toRemove,
    remaining
  };
}
