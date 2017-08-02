import { combineReducers } from 'redux';

function createSubtreeReducer({ reducer, methods }) {
  if (!reducer || !methods) {
    throw new Error('Invalid object passed as action reducer, make sure you use the actionReducer function properly')
  }
  const methodCache = {};
  const findMethod = action => {
    if (!(action.type in methodCache)) {
      methodCache[action.type] = action.variants && methods.find(key => action.variants.includes(key));
    }
    return methodCache[action.type];
  };
  return (subtreeState, action) => {
    //eslint-disable-next-line no-undefined
    if (subtreeState === undefined) {
      return reducer.initialState ? reducer.initialState() : {};
    }
    const reducerMethod = findMethod(action);
    if (reducerMethod) {
      return reducer[reducerMethod].bind(reducer)(...action.payload, subtreeState);
    }
    return subtreeState;
  };
}

function objectMap(obj, mapFn) {
  return Object.assign({}, ...Object.entries(obj).map(([key, val]) => ({[key]: mapFn(val)})));
}

export default function combineActionReducers(actionReducers) {
  const reducersMap = Object.assign({}, ...actionReducers.map(actionReducer => ({[actionReducer.name]: actionReducer})));
  const storeReducers = objectMap(reducersMap, actionReducer => createSubtreeReducer(actionReducer));
  return combineReducers(storeReducers);
}
