import { combineReducers, bindActionCreators } from 'redux';

function createSubtreeReducer({ reducer, methods }) {
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
            return reducer.initialState();
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

function combineAllReducers(actionReducers) {
    const reducersMap = Object.assign({}, ...actionReducers.map(actionReducer => ({[actionReducer.name]: actionReducer})));
    const storeReducers = objectMap(reducersMap, actionReducer => createSubtreeReducer(actionReducer));
    return combineReducers(storeReducers);
}

function bindAllActionCreators(actionCreators, dispatch) {
    const boundActionCreators = actionCreators.map(ac => bindActionCreators(ac, dispatch));
    actionCreators.forEach((actionCreator, i) => {
        const boundActionCreator = boundActionCreators[i];
        Object.keys(actionCreator).forEach(key => {
            actionCreator[key] = boundActionCreator[key];
            actionCreator[key].defer = (...args) => setTimeout(() => actionCreator[key](...args));
        });
    });
}

export default function actionReducersEnhancer() {
    return (createStore) => ({actionReducers, actionCreators}, preloadedState, enhancer) => {
        const storeReducer = combineAllReducers(actionReducers);
        const store = createStore(storeReducer, preloadedState, enhancer);
        bindAllActionCreators(actionCreators, store.dispatch);
        return store;
    };
}
