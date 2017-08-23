import actionDispatcher from '../src/actionDispatcher'

describe('Action Dispatcher Tests', () => {
  class A {
  }

  it('checks action dispatchers creation', () => {
    const dispatch = jest.fn();
    const actions = actionDispatcher({ dispatch, actions: ['someAction']})(A);

    expect(actions).toBe(A);
    expect(A.someAction).toEqual(expect.any(Function));
    A.someAction(1, 2, 3);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'someAction', payload: [1, 2, 3]}));
  });

  it('should fail no class', () => {
    expect(() => actionDispatcher({})()).toThrow(/actionDispatcher needs a class/);
  });

  it('should fail no actions', () => {
    expect(() => actionDispatcher({})(A)).toThrow(/actions needs to be an array/);
  });

});
