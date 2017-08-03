function getClassMethods(instance) {
  return [
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(instance)),
    ...Object.getOwnPropertyNames(instance).filter(f => typeof instance[f] === 'function')
  ].filter(m => m !== 'constructor');
}

function createSliceReducer({ reducer, methods, slice, reducerClass }) {
  const methodCache = {};
  const findMethod = action => {
    if (!(action.type in methodCache)) {
      methodCache[action.type] = methods.find(key => action.variants ? action.variants.includes(key) : key === action.type);
    }
    return methodCache[action.type];
  };
  const sliceReducer = (sliceState, action) => {
    //eslint-disable-next-line no-undefined
    if (sliceState === undefined) {
      const initializer = reducer.initialState || reducerClass.initialState || (() => ({}));
      return initializer.bind(reducer)();
    }
    const reducerMethod = findMethod(action);
    if (reducerMethod) {
      return reducer[reducerMethod].bind(reducer)(...action.payload, sliceState);
    }
    return sliceState;
  };
  sliceReducer.slice = slice;
  return sliceReducer;
}

export default function actionReducer(slice) {
  return (reducerClass) => {
    const instance = new reducerClass();
    return createSliceReducer({
      reducerClass,
      slice,
      reducer: instance,
      methods: getClassMethods(instance)
    })
  };
}
