import bindAllActionDispatchers from './bindAllActionDispatchers';
import combineSliceReducers from './combineSliceReducers';

function assertArg(cond, errorMessage) {
  if (!cond) {
    throw new Error(errorMessage);
  }
}

export default function boileroutEnhancer() {
    return (createStore) => (mainReducer, preloadedState, enhancer) => {
        assertArg(typeof mainReducer === 'object' && mainReducer !== null, 'Expecting first argument to be an object');
        const { sliceReducers, actionDispatchers = []} = mainReducer;
        assertArg(Array.isArray(sliceReducers) && sliceReducers.length, 'Expecting sliceReducers to be an array with at least one action reducer');
        assertArg(Array.isArray(actionDispatchers), 'Expecting actionDispatchers to be an array');
        const storeReducer = combineSliceReducers(sliceReducers);
        const store = createStore(storeReducer, preloadedState, enhancer);
        bindAllActionDispatchers(actionDispatchers, store.dispatch);
        return store;
    };
}
