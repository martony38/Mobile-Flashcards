export function groupByThree(items) {
  return items.reduce((acc, currentValue) => {
    if (acc.length === 0) {
      acc.push([currentValue]);
    } else if (acc[acc.length - 1].length < 3) {
      acc[acc.length - 1].push(currentValue);
    } else {
      acc.push([currentValue]);
    }
    return acc
  },[]);
}