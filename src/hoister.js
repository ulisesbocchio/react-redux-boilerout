import React from 'react';

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

export function hoistComponentBehavior(component, behaviour) {
    class HoistedComponent extends React.Component {
        render() {
            return React.createElement(component, this.props);
        }
    }
    hoistClassBehavior(HoistedComponent, behaviour);
    HoistedComponent.propTypes = component.propTypes;
    HoistedComponent.defaultProps = component.defaultProps;
    HoistedComponent.displayName = `HoistedComponent(${component.displayName || component.name || 'Component'})`;
    return HoistedComponent;
}
