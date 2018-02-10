import generateActionDispatchers from './generateActionDispatchers';

export default function actionDispatcher({ dispatch, actions, namespace: providedNamespace }) {
    return clazz => {
        if (typeof clazz !== 'function') {
            throw new Error('actionDispatcher needs a class');
        }
        if (!Array.isArray(actions)) {
            throw new Error('actions needs to be an array');
        }
        let namespace = providedNamespace;
        if (!namespace) {
            namespace = clazz.name;
        }
        Object.assign(clazz, generateActionDispatchers({ dispatch, options: { namespace }, actions }));
        return clazz;
    };
}
