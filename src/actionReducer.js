function getClassMethods(instance) {
  return [
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(instance)),
    ...Object.getOwnPropertyNames(instance).filter(f => typeof instance[f] === 'function')
  ].filter(m => m !== 'constructor');
}

export default function actionReducer(name) {
  return (reducerClass) => {
    const instance = new reducerClass();
    return {
      name,
      clazz: reducerClass,
      reducer: instance,
      methods: getClassMethods(instance),
      //eslint-disable-next-line no-unused-vars
      selector: (state, props) => state[name]
    }
  };
}
