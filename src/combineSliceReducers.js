import { combineReducers } from 'redux';

export default function combineSliceReducers(sliceReducers) {
  const reducersMap = Object.assign({}, ...sliceReducers.map(sliceReducer => {
    if (!sliceReducer.slice) {
      throw new Error('Invalid object passed as action reducer, make sure you use the sliceReducer function properly')
    }
    return { [sliceReducer.slice]: sliceReducer }
  }));
  return combineReducers(reducersMap);
}
