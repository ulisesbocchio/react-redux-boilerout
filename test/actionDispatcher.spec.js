import { actionDispatcher } from '../src/index';

describe('Action Dispatcher Tests', () => {
    it('checks action dispatchers creation', () => {
        class A {}
        const dispatch = jest.fn();
        const actions = actionDispatcher({ dispatch, actions: ['someAction'] })(A);

        expect(actions).toBe(A);
        expect(A.someAction).toEqual(expect.any(Function));
        A.someAction(1, 2, 3);
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'someAction', payload: [1, 2, 3], _namespace: 'A' })
        );
    });

    it('checks action dispatchers creation with custom namespace', () => {
        const dispatch = jest.fn();
        @actionDispatcher({ dispatch, namespace: 'pepe', actions: ['someAction'] })
        class A {}

        expect(A.someAction).toEqual(expect.any(Function));
        A.someAction(1, 2, 3);
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'someAction', payload: [1, 2, 3], _namespace: 'pepe' })
        );
    });

    it('should fail no class', () => {
        expect(() => actionDispatcher({})()).toThrow(/actionDispatcher needs a class/);
    });

    it('should fail no actions', () => {
        class A {}
        expect(() => actionDispatcher({})(A)).toThrow(/actions needs to be an array/);
    });

    it('should add default namespace to action dispatcher', () => {
        const dispatch = jest.fn();

        @actionDispatcher({ dispatch, actions: ['someAction'] })
        class B {}

        expect(B.namespace).toEqual('B');
    });

    it('should add custom namespace to action dispatcher', () => {
        const dispatch = jest.fn();

        @actionDispatcher({ dispatch, namespace: 'pepe', actions: ['someAction'] })
        class B {}

        expect(B.namespace).toEqual('pepe');
    });
});
