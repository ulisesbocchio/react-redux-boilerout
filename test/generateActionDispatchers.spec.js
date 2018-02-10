import { generateActionDispatchers } from '../src';
import { storeHolder } from '../src';

function deferred() {
    let resolve = null,
        reject = null;
    let promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        resolve,
        reject
    };
}

describe('Generate Action Creator Tests', () => {
    it('checks actual actions are created', () => {
        const actionDispatchers = generateActionDispatchers({
            dispatch: () => {},
            actions: ['update', 'remove', 'SOME_ACTION']
        });
        expect(actionDispatchers).toHaveProperty('update');
        expect(actionDispatchers).toHaveProperty('remove');
        expect(actionDispatchers).toHaveProperty('someAction');
    });

    it('checks actual actions are created with namespace', () => {
        const actionDispatchers = generateActionDispatchers({
            dispatch: () => {},
            options: { namespace: 'pepe' },
            actions: ['update', 'remove', 'SOME_ACTION']
        });
        expect(actionDispatchers).toHaveProperty('update');
        expect(actionDispatchers).toHaveProperty('remove');
        expect(actionDispatchers).toHaveProperty('someAction');
        expect(actionDispatchers.namespace).toEqual('pepe');
    });

    it('checks that it fails when dispatch is not passed', () => {
        expect(() => generateActionDispatchers({ actions: 'update' })).toThrowError(/Array with one action required/);
    });

    it('checks that it fails when no arg is passed', () => {
        expect(() => generateActionDispatchers()).toThrowError(/Array with one action required/);
    });

    it('checks that it DOES NOT fail when dispatch is not passed, and dispatch from storeHolder is populated', () => {
        const createStore = () => ({ dispatch() {} });
        storeHolder(createStore)();
        expect(generateActionDispatchers({ actions: ['update'] })).toHaveProperty('update');
        const destroyStore = () => {};
        storeHolder(destroyStore)();
    });

    it('checks that it fails when dispatch is not a function', () => {
        expect(() => generateActionDispatchers({ dispatch: {}, actions: 'update' })).toThrowError(
            /dispatch needs to be a function/
        );
    });

    it('checks that it fails when no actions are passed', () => {
        expect(() => generateActionDispatchers({ dispatch: () => {} })).toThrowError(/Array with one action required/);
    });

    it('checks that it fails when action is not a string', () => {
        expect(() => generateActionDispatchers({ dispatch: () => {}, actions: [{}] })).toThrowError(
            /actions need to be string/
        );
    });

    it('checks regular action creator function is there and returns', () => {
        let action = null;
        const dispatch = a => (action = a);
        const actionDispatchers = generateActionDispatchers({ dispatch, actions: ['update'] });
        const namespace = actionDispatchers.namespace;
        expect(!!namespace).toEqual(true);
        expect(actionDispatchers).toHaveProperty('update');
        actionDispatchers.update('arg0');
        expect(action).toMatchObject({
            type: 'update',
            payload: ['arg0'],
            variants: ['update', 'onUpdate'],
            _namespace: namespace
        });
    });

    it('checks regular action creator function is there and returns, when using storeHolder', () => {
        let action = null;
        const createStore = () => ({
            dispatch(a) {
                action = a;
            }
        });
        storeHolder(createStore)();
        const actionDispatchers = generateActionDispatchers({ actions: ['update'] });
        const namespace = actionDispatchers.namespace;
        expect(!!namespace).toEqual(true);
        expect(actionDispatchers).toHaveProperty('update');
        actionDispatchers.update('arg0');
        const destroyStore = () => {};
        storeHolder(destroyStore)();
        expect(action).toMatchObject({
            type: 'update',
            payload: ['arg0'],
            variants: ['update', 'onUpdate'],
            _namespace: namespace
        });
    });

    it('checks regular action creator defer function is there and returns', async () => {
        const actionDeferred = deferred();
        const dispatch = a => actionDeferred.resolve(a);
        const actionDispatchers = generateActionDispatchers({ dispatch: dispatch, actions: ['update'] });
        const namespace = actionDispatchers.namespace;
        expect(!!namespace).toEqual(true);
        expect(actionDispatchers.update).toHaveProperty('defer');
        actionDispatchers.update.defer('arg0');
        const action = await actionDeferred.promise;
        expect(action).toMatchObject({
            type: 'update',
            payload: ['arg0'],
            variants: ['update', 'onUpdate'],
            _namespace: namespace
        });
    });

    it('checks UPPER_CASED action creator function is there and returns', () => {
        let action = null;
        const dispatch = a => (action = a);
        const actionDispatchers = generateActionDispatchers({ dispatch, actions: ['UPDATE_SOMETHING'] });
        const namespace = actionDispatchers.namespace;
        expect(!!namespace).toEqual(true);
        expect(actionDispatchers).toHaveProperty('updateSomething');
        actionDispatchers.updateSomething({ some: 'value' }, [1, 2, 3]);
        expect(action).toMatchObject({
            type: 'UPDATE_SOMETHING',
            payload: [{ some: 'value' }, [1, 2, 3]],
            variants: ['updateSomething', 'onUpdateSomething'],
            _namespace: namespace
        });
    });
});
