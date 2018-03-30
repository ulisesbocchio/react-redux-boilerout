import combineSliceReducers from './combineSliceReducers';
import registerSliceReducer from './registerSliceReducer';
import actionDispatcher from './actionDispatcher';
import sliceContainer from './sliceContainer';

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
            store: this.store,
            ...opts
        })
    }

    get actionDispatcher() {
        return ({ ...opts }) => actionDispatcher({
            dispatch: (...args) => this.store.dispatch(...args),
            ...opts
        })
    }

    get enhancer() {
        const _this = this;
        return function storeHolderEnhancer(createStore) {
            return (...args) => {
                const newStore = createStore(...args);
                _this.store = newStore;
                return newStore;
            };
        }
    }

    get sliceContainer() {
        return sliceContainer
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
