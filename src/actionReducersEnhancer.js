import bindAllActionDispatchers from './bindAllActionDispatchers';
import combineActionReducers from './combineActionReducers';

function assertArg(cond, errorMessage) {
  if (!cond) {
    throw new Error(errorMessage);
  }
}

export default function actionReducersEnhancer() {
    return (createStore) => (mainReducer, preloadedState, enhancer) => {
        assertArg(typeof mainReducer === 'object' && mainReducer !== null, 'Expecting first argument to be an object');
        const { actionReducers, actionDispatchers = []} = mainReducer;
        assertArg(Array.isArray(actionReducers) && actionReducers.length, 'Expecting actionReducers to be an array with at least one action reducer');
        assertArg(Array.isArray(actionDispatchers), 'Expecting actionDispatchers to be an array');
        const storeReducer = combineActionReducers(actionReducers);
        const store = createStore(storeReducer, preloadedState, enhancer);
        bindAllActionDispatchers(actionDispatchers, store.dispatch);
        return store;
    };
}
