import connectSlice from './connectSlice';

const LIFECYCLE_EVENTS = ['componentWillMount', 'render', 'componentDidMount', 'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate', 'componentDidUpdate', 'componentWillUnmount'];

function getLifecycleMethods(clazz) {
  const lifecycleBehavior = Reflect.ownKeys(clazz.prototype)
    .filter(method => LIFECYCLE_EVENTS.includes(method));
  let hoister;
  for (let property of lifecycleBehavior) {
    if (!hoister) {
      hoister = {};
    }
    Object.defineProperty(hoister, property, Reflect.getOwnPropertyDescriptor(clazz.prototype, property));
  }
  return hoister;
}

export default function sliceContainer({slice, actions, component}) {
  return (containerClass) => {

    if (typeof containerClass !== 'function') {
      throw new Error('sliceContainer needs a class');
    }

    const hoist = getLifecycleMethods(containerClass);

    const inject = containerClass.inject && containerClass.inject();
    const mapSliceStateToProps = containerClass.mapSliceStateToProps && containerClass.mapSliceStateToProps.bind(containerClass);
    const mapDispatchToProps = containerClass.mapDispatchToProps && containerClass.mapDispatchToProps.bind(containerClass);

    return connectSlice({ slice, actions, inject, hoist }, mapSliceStateToProps, mapDispatchToProps)(component);
  };
}
