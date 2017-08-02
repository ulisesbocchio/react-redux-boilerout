import bindAllActionCreators from './bindAllActionCreators';
import combineActionReducers from './combineActionReducers';

function assertArg(cond, errorMessage) {
  if (!cond) {
    throw new Error(errorMessage);
  }
}

export default function actionReducersEnhancer() {
    return (createStore) => (mainReducer, preloadedState, enhancer) => {
        assertArg(typeof mainReducer === 'object' && mainReducer !== null, 'Expecting first argument to be an object');
        const { actionReducers, actionCreators = []} = mainReducer;
        assertArg(Array.isArray(actionReducers) && actionReducers.length, 'Expecting actionReducers to be an array with at least one action reducer');
        assertArg(Array.isArray(actionReducers), 'Expecting actionReducers to be an array');
        const storeReducer = combineActionReducers(actionReducers);
        const store = createStore(storeReducer, preloadedState, enhancer);
        bindAllActionCreators(actionCreators, store.dispatch);
        return store;
    };
}
