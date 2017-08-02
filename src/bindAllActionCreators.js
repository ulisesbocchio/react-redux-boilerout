import { bindActionCreators } from 'redux';

export default function bindAllActionCreators(actionCreators, dispatch) {
  const boundActionCreators = actionCreators.map(ac => bindActionCreators(ac, dispatch));
  actionCreators.forEach((actionCreator, i) => {
    const boundActionCreator = boundActionCreators[i];
    Object.keys(actionCreator).forEach(key => {
      actionCreator[key] = boundActionCreator[key];
      actionCreator[key].defer = (...args) => setTimeout(() => actionCreator[key](...args));
    });
  });
}
