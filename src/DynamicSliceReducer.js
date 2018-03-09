import combineSliceReducers from './combineSliceReducers';
import registerSliceReducer from './registerSliceReducer';
import actionDispatcher from './actionDispatcher';
import storeHolder from './storeHolder';

export default class DynamicSliceReducer {
    constructor() {
        this.sliceReducers = [];
        this.combinedSlicesReducer = s => s || {};
        this.id = Math.random()
            .toString(12)
            .substring(2)
    }

    get registerSliceReducer() {
        return ({ ...opts }) => registerSliceReducer({
            store: storeHolder.getStore(this),
            ...opts
        })
    }

    get actionDispatcher() {
        return ({ ...opts }) => actionDispatcher({
            dispatch: (...args) => storeHolder.getDispatch(this)(...args),
            ...opts
        })
    }

    get enhancer() {
        return storeHolder(this);
    }

    register(sliceReducer) {
        const instance = new sliceReducer();
        this.sliceReducers.push(instance);
        this.combinedSlicesReducer = combineSliceReducers(...this.sliceReducers);
        return instance;
    }

    get reducer() {
        return (state, action) => {
            return this.combinedSlicesReducer(state, action);
        };
    }
}
