import generateActionDispatchers from './generateActionDispatchers';

export default function actionDispatcher({ dispatch, actions }) {
  return (clazz) => {
    if (typeof clazz !== 'function') {
      throw new Error('actionDispatcher needs to a class');
    }
    if (!Array.isArray(actions)) {
      throw new Error('actions needs to be an array');
    }
    return Object.assign(clazz, generateActionDispatchers(dispatch, ...actions));
  }
}
