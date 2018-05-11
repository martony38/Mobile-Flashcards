// Taken from Udacity Redux course
// (https://github.com/udacity/reactnd-chirper-app/blob/6176c497a95b10c101a0d9104a160d44645b40f2/src/middleware/logger.js)
const logger = (store) => (next) => (action) => {
  console.group(action.type);
    console.log('The action: ', action);
    const returnValue = next(action);
    console.log('The new state: ', store.getState());
  console.groupEnd();
  return returnValue;
};

export default logger;
