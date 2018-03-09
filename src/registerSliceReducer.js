import DynamicSliceReducer from './DynamicSliceReducer';

export default function({ store, registry } = {}) {
    if (!store || typeof store.dispatch !== 'function') {
        throw new Error('Invalid store object');
    }
    if (!(registry instanceof DynamicSliceReducer)) {
        throw new Error(`${registry} is not a DynamicSliceReducer`);
    }
    return sliceReducer => {
        const reducer = registry.register(sliceReducer);
        store.dispatch({ type: '@@boilerout/INIT' });
        return reducer;
    };
}
