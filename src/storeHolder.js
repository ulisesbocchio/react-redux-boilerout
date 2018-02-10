let store;

export function getStore() {
    return store;
}

export function getDispatch() {
    return store && store.dispatch;
}

export default function storeHolder(createStore) {
    return (...args) => {
        const newStore = createStore(...args);
        store = newStore;
        return newStore;
    };
}
