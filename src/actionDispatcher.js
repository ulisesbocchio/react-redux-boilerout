import generateActionDispatchers from './generateActionDispatchers';

export default function actionDispatcher({ dispatch, actions }) {
  return (clazz) => {
    if (typeof clazz !== 'function') {
      throw new Error('actionDispatcher needs a class');
    }
    if (!Array.isArray(actions)) {
      throw new Error('actions needs to be an array');
    }
    Object.assign(clazz, generateActionDispatchers(dispatch, ...actions));
    return clazz;
  }
}
