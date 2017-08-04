function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function actionVariants(type) {
  const normalized = normalizeActionName(type);
  return [normalized, `on${capitalize(normalized)}`];
}

function normalizeActionName(type) {
  if (type.match(/_/)) {
    return type.toLowerCase().split(/_/g).map((s, i) => i > 0 ? capitalize(s) : s).join('');
  }
  return type;
}

function actionDispatcher(dispatch, actionCreator) {
  const dispatchAction = (...args) => dispatch(actionCreator(...args));
  dispatchAction.defer = (...args) => setTimeout(() => dispatchAction(...args));
  return dispatchAction;
}

function actionCreator(action) {
  const variants = actionVariants(action);
  return (...args) => ({
    type: action,
    payload: args,
    variants
  })
}

export default function generateActionDispatchers(dispatch, ...actions) {
  if (!dispatch || typeof dispatch !== 'function') {
    throw new Error('dispatch function required');
  }
  if (!actions.length) {
    throw new Error('at least one action required');
  }
  if (actions.some(action => typeof action !== 'string')) {
    throw new Error('actions need to be strings');
  }
  return Object.assign(...actions.map( action => ({ [normalizeActionName(action)]: actionDispatcher(dispatch, actionCreator(action)) }) ));
}
