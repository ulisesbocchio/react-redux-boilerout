const storeRegistry = {};

export function getStore(dynamicSliceReducer) {
    return storeRegistry[dynamicSliceReducer.id];
}

export function getDispatch(dynamicSliceReducer) {
    const store = getStore(dynamicSliceReducer);
    return store && store.dispatch;
}

export default function storeHolder(dynamicSliceReducer) {
    return function storeHolderEnhancer(createStore) {
        return (...args) => {
            const newStore = createStore(...args);
            storeRegistry[dynamicSliceReducer.id] = newStore;
            return newStore;
        };
    }
}
