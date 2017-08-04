import { generateActionDispatchers } from '../src'

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
      const actionDispatchers = generateActionDispatchers(()=>{}, 'update', 'remove', 'SOME_ACTION');
      expect(actionDispatchers).toHaveProperty('update');
      expect(actionDispatchers).toHaveProperty('remove');
      expect(actionDispatchers).toHaveProperty('someAction');
    });

    it('checks that if fails when dispatch is not passed', () => {
      expect(() => generateActionDispatchers('update')).toThrowError(/dispatch function required/);
    });

    it('checks that if fails when dispatch is not a function', () => {
      expect(() => generateActionDispatchers({}, 'update')).toThrowError(/dispatch function required/);
    });

    it('checks that if fails when no actions are passed', () => {
      expect(() => generateActionDispatchers(()=>{})).toThrowError(/at least one action/);
    });

    it('checks that if fails when action is not a string', () => {
      expect(() => generateActionDispatchers(()=>{}, 'update', {})).toThrowError(/actions need to be string/);
    });

    it('checks regular action creator function is there and returns', () => {
      let action = null;
      const dispatch = (a) => action = a;
      const actionDispatchers = generateActionDispatchers(dispatch, 'update');
      expect(actionDispatchers).toHaveProperty('update');
      actionDispatchers.update('arg0');
      expect(action).toMatchObject({
        type: 'update',
        payload: ['arg0'],
        variants: ['update', 'onUpdate']
      })
    });

  it('checks regular action creator defer function is there and returns', async () => {
    const actionDeferred = deferred();
    const dispatch = (a) => actionDeferred.resolve(a);
    const actionDispatchers = generateActionDispatchers(dispatch, 'update');
    expect(actionDispatchers.update).toHaveProperty('defer');
    actionDispatchers.update.defer('arg0');
    const action = await actionDeferred.promise;
    expect(action).toMatchObject({
      type: 'update',
      payload: ['arg0'],
      variants: ['update', 'onUpdate']
    })
  });

    it('checks UPPER_CASED action creator function is there and returns', () => {
      let action = null;
      const dispatch = (a) => action = a;
      const actionDispatchers = generateActionDispatchers(dispatch, 'UPDATE_SOMETHING');
      expect(actionDispatchers).toHaveProperty('updateSomething');
      actionDispatchers.updateSomething({some: 'value'}, [1, 2, 3]);
      expect(action).toMatchObject({
        type: 'UPDATE_SOMETHING',
        payload: [{some: 'value'}, [1, 2, 3]],
        variants: ['updateSomething', 'onUpdateSomething']
      })
    });
});
