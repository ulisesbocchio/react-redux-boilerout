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

function actionDispatcher(actionCreator) {
  let dispatch = null;
  const dispatchAction = (...args) => {
    if (!dispatch) {
      throw new Error('dispatch function not initialized, make sure you passed actionCreators to boileroutEnhancer on store creation');
    }
    dispatch(actionCreator(...args));
  };
  dispatchAction._setDispatch = d => dispatch = d;
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

export default function generateActionDispatchers(...actions) {
  if (!actions.length) {
    return {};
  }
  return Object.assign(...actions.map( action => ({ [normalizeActionName(action)]: actionDispatcher(actionCreator(action)) }) ));
}
