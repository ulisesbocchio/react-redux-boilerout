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

export default function generateActionCreators(...actions) {
  return Object.assign({}, ...actions.map(action => {
    const variants = actionVariants(action);
    return {[normalizeActionName(action)]: (...args) => ({
      type: action,
      payload: args,
      variants
    })}
  }));
}
