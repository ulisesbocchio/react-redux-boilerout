import { combineReducers } from 'redux';

export default function combineActionReducers(actionReducers) {
  const reducersMap = Object.assign({}, ...actionReducers.map(actionReducer => {
    if (!actionReducer.slice) {
      throw new Error('Invalid object passed as action reducer, make sure you use the actionReducer function properly')
    }
    return { [actionReducer.slice]: actionReducer }
  }));
  return combineReducers(reducersMap);
}
