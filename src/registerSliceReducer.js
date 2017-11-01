import DynamicSliceReducer from './DynamicSliceReducer';

export default function(store, dynamicSliceReducer) {
    if (!store || typeof store.dispatch !== 'function') {
        throw new Error('Invalid store object');
    }
    if (!(dynamicSliceReducer instanceof DynamicSliceReducer)) {
        throw new Error(`${dynamicSliceReducer} is not a DynamicSliceReducer`);
    }
    return sliceReducer => {
        const reducer = dynamicSliceReducer.register(sliceReducer);
        store.dispatch({ type: '@@boilerout/INIT' });
        return reducer;
    };
}
