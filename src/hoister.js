import React from 'react'

export function hoistClassBehavior(clazz, behaviour) {
  const instanceKeys = Reflect.ownKeys(behaviour);
  for (let property of instanceKeys) {
    const hoistedDescriptor = Reflect.getOwnPropertyDescriptor(behaviour, property);
    const originalDescriptor = Reflect.getOwnPropertyDescriptor(clazz.prototype, property);
    const mergedDescriptor = Object.assign({}, originalDescriptor, hoistedDescriptor, {
      value: function(...args) {
        const hoistedRet = hoistedDescriptor.value.bind(this)(...args);
        const originalRet = originalDescriptor && originalDescriptor.value.bind(this)(...args);
        return typeof originalRet !== 'undefined' ? originalRet : hoistedRet;
      }
    });

    Object.defineProperty(clazz.prototype, property, mergedDescriptor);
  }
  return clazz;
}

export function hoistFunctionalBehavior(functionalComponent, behaviour) {
  class HoistedComponent extends React.Component {
    render() {
      return functionalComponent(this.props);
    }
  }
  hoistClassBehavior(HoistedComponent, behaviour);
  HoistedComponent.propTypes = functionalComponent.propTypes;
  HoistedComponent.defaultProps = functionalComponent.defaultProps;
  return HoistedComponent;
}
