import { generateActionDispatchers, bindAllActionDispatchers } from '../src'

function deferred() {
  let resolve = null, reject = null;
  let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve,
    reject
  }
}

describe('Generate Action Creator Tests', () => {
    it('checks actual actions are created', () => {
      const actionDispatchers = generateActionDispatchers('update', 'remove', 'SOME_ACTION');
      expect(actionDispatchers).toHaveProperty('update');
      expect(actionDispatchers).toHaveProperty('remove');
      expect(actionDispatchers).toHaveProperty('someAction');
    });

    it('checks that if fails when dispatch is not bound', () => {
      const actionDispatchers = generateActionDispatchers('update');
      expect(() => actionDispatchers.update('arg0')).toThrowError(/dispatch function not initialized/);
    });

    it('checks regular action creator function is there and returns', () => {
      const actionDispatchers = generateActionDispatchers('update');
      expect(actionDispatchers).toHaveProperty('update');
      let action = null;
      bindAllActionDispatchers([actionDispatchers], (a) => action = a);
      actionDispatchers.update('arg0');
      expect(action).toMatchObject({
        type: 'update',
        payload: ['arg0'],
        variants: ['update', 'onUpdate']
      })
    });

  it('checks regular action creator defer function is there and returns', async () => {
    const actionDispatchers = generateActionDispatchers('update');
    expect(actionDispatchers.update).toHaveProperty('defer');
    const actionDeferred = deferred();
    bindAllActionDispatchers([actionDispatchers], (a) => actionDeferred.resolve(a));
    actionDispatchers.update.defer('arg0');
    const action = await actionDeferred.promise;
    expect(action).toMatchObject({
      type: 'update',
      payload: ['arg0'],
      variants: ['update', 'onUpdate']
    })
  });

    it('checks UPPER_CASED action creator function is there and returns', () => {
      const actionDispatchers = generateActionDispatchers('UPDATE_SOMETHING');
      expect(actionDispatchers).toHaveProperty('updateSomething');
      let action = null;
      bindAllActionDispatchers([actionDispatchers], (a) => action = a);
      actionDispatchers.updateSomething({some: 'value'}, [1, 2, 3]);
      expect(action).toMatchObject({
        type: 'UPDATE_SOMETHING',
        payload: [{some: 'value'}, [1, 2, 3]],
        variants: ['updateSomething', 'onUpdateSomething']
      })
    });
});
