import mixin from './mixin';

function getClassMethods(instance) {
    return [
        ...Object.getOwnPropertyNames(Object.getPrototypeOf(instance)),
        ...Object.getOwnPropertyNames(instance).filter(f => typeof instance[f] === 'function')
    ].filter(
        m =>
            ![
                'constructor',
                '_namespace',
                '_action',
                'slice',
                'reducer',
                'getInitialState',
                '_findMethod',
                '_reducerFn'
            ].includes(m)
    );
}

function createMixin(slice) {
    return mixin({
        _findMethod(action) {
            if (!(action.type in this._methodCache)) {
                this._methodCache[action.type] = this._methods.find(methodName => {
                    const key = this[methodName]._action || methodName;
                    return action.variants ? action.variants.includes(key) : key === action.type;
                });
            }
            return this._methodCache[action.type];
        },

        _reducerFn(sliceState, action) {
            if (sliceState === undefined) {
                return this.getInitialState();
            }
            const reducerMethod = this._findMethod(action);
            const namespace = (reducerMethod && this[reducerMethod]._namespace) || this._namespace;
            if (reducerMethod && (!namespace || namespace === action._namespace)) {
                return this[reducerMethod](sliceState, ...(action._namespace ? action.payload : [action.payload]));
            }
            return sliceState;
        },

        reducer() {
            this._methods = getClassMethods(this);
            this._methodCache = {};
            return this._reducerFn.bind(this);
        },

        slice() {
            return slice;
        },

        getInitialState() {
            const initializer = this.initialState || this.constructor.initialState || (() => ({}));
            return initializer.bind(this)();
        }
    });
}

export default function sliceReducer(slice) {
    const reducerMixin = createMixin(slice);
    return clazz => {
        if (typeof clazz !== 'function') {
            throw new Error('sliceReducer needs a class as argument');
        }
        return reducerMixin(clazz);
    };
}
