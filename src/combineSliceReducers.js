import { combineReducers } from 'redux';

export default function combineSliceReducers(...sliceReducers) {
  const reducersMap = Object.assign({}, ...sliceReducers.map(sliceReducer => {
    let actualSliceReducer = sliceReducer;
    if (typeof sliceReducer === 'function') {
      actualSliceReducer = new sliceReducer();
    }
    if (typeof actualSliceReducer.slice !== 'function') {
      throw new Error('Invalid object passed as slice reducer, make sure you use the sliceReducer function properly')
    }
    return { [actualSliceReducer.slice()]: actualSliceReducer.reducer() }
  }));
  return combineReducers(reducersMap);
}
