import mixin from './mixin';

function getClassMethods(instance) {
  return [
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(instance)),
    ...Object.getOwnPropertyNames(instance).filter(f => typeof instance[f] === 'function')
  ].filter(m => m !== 'constructor');
}

function createMixin(slice) {
return mixin({
    reducer() {
      const methods = getClassMethods(this);
      const methodCache = {};
      const findMethod = action => {
        if (!(action.type in methodCache)) {
          methodCache[action.type] = methods.find(key => action.variants ? action.variants.includes(key) : key === action.type);
        }
        return methodCache[action.type];
      };
      return (sliceState, action) => {
        if (sliceState === undefined) {
          return this.getInitialState();
        }
        const reducerMethod = findMethod(action);
        if (reducerMethod) {
          return this[reducerMethod](...action.payload, sliceState);
        }
        return sliceState;
      }
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
  return (clazz) => {
    if (typeof clazz !== 'function') {
      throw new Error('sliceReducer needs a class as argument')
    }
    return reducerMixin(clazz);
  }
}
