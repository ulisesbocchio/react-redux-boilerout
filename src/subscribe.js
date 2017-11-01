export default function subscribe({ namespace, action } = {}) {
    return function(target, property, descriptor) {
        const annotationTarget = descriptor ? descriptor.value : target.prototype;
        if (!descriptor) {
            // It's a class when no descriptor.
            if (!namespace) {
                // namespace needs to be truthy.
                throw new Error('namespace is required on class decorator');
            }
            if (action) {
                // class subscribe shouldn't have action.
                throw new Error('action param is only allowed on class members');
            }
        } else {
            // It's a class member if we have descriptor.
            if (!action && !namespace) {
                throw new Error('namespace and/or action are required on member decorator');
            }
        }

        // istanbul ignore else
        if (typeof annotationTarget !== 'undefined') {
            Object.assign(annotationTarget, { _namespace: namespace, _action: action });
        } else if (!annotationTarget && descriptor.initializer) {
            const originalInitializer = descriptor.initializer;
            descriptor.initializer = function() {
                const prop = originalInitializer.call(target);
                // istanbul ignore else
                if (typeof prop !== 'undefined') {
                    Object.assign(prop, { _namespace: namespace, _action: action });
                } else {
                    throw new Error("Can't decorate undefined/null property");
                }
                return prop;
            };
        } else {
            throw new Error("Can't decorate undefined/null property");
        }
        return descriptor || target;
    };
}
