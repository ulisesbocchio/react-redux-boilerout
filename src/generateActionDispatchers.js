import { getDispatch } from './storeHolder';

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

function actionVariants(type) {
    const normalized = normalizeActionName(type);
    return [normalized, `on${capitalize(normalized)}`];
}

function normalizeActionName(type) {
    if (type.match(/_/)) {
        return type
            .toLowerCase()
            .split(/_/g)
            .map((s, i) => (i > 0 ? capitalize(s) : s))
            .join('');
    }
    return type;
}

function actionDispatcher(dispatchHolder, actionCreator) {
    const dispatchAction = (...args) => dispatchHolder()(actionCreator(...args));
    dispatchAction.defer = (...args) => setTimeout(() => dispatchAction(...args));
    return dispatchAction;
}

function createActionCreator(action, _namespace) {
    const variants = actionVariants(action);
    return (...args) => ({
        type: action,
        payload: args,
        variants,
        _namespace
    });
}

export default function generateActionDispatchers({ dispatch, options = {}, actions } = {}) {
    if (dispatch && typeof dispatch !== 'function') {
        throw new Error('dispatch needs to be a function');
    }

    const dispatchHolder = dispatch ? () => dispatch : getDispatch;

    if (!actions || !Array.isArray(actions) || !actions.length) {
        throw new Error('at least an Array with one action required');
    }

    if (actions.some(action => typeof action !== 'string')) {
        throw new Error('actions need to be strings');
    }

    const {
        namespace = Math.random()
            .toString(12)
            .substring(2)
    } = options;
    return Object.assign(
        ...actions.map(action => ({
            [normalizeActionName(action)]: actionDispatcher(dispatchHolder, createActionCreator(action, namespace))
        })),
        { namespace }
    );
}
