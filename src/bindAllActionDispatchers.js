
export default function bindAllActionDispatchers(actionDispatchers, dispatch) {
  actionDispatchers.forEach(actionDispatcher =>
    Object.values(actionDispatcher).forEach(dispatcher => dispatcher._setDispatch(dispatch))
  );
}
