import { registerSliceReducer, DynamicSliceReducer, storeHolder } from '../src';

class A {
    someMethod() {}
}

describe('registerSliceReducer Tests', () => {
    it('checks slice reducer registration', () => {
        const store = {
            dispatch: jest.fn()
        };

        const dynamicReducer = new DynamicSliceReducer();
        dynamicReducer.register = jest.fn();

        dynamicReducer.register.mockImplementation(a => new a());

        const reducer = registerSliceReducer({ store, registry: dynamicReducer })(A);
        expect(reducer).toBeInstanceOf(A);
        expect(dynamicReducer.register).toHaveBeenCalledWith(A);
        expect(store.dispatch).toHaveBeenCalledWith({ type: '@@boilerout/INIT' });
    });

    it('checks slice reducer registration with store registered through storeHolder', () => {
        const store = {
            dispatch: jest.fn()
        };
        const createStore = () => store;
        storeHolder(createStore)();
        const dynamicReducer = new DynamicSliceReducer();

        dynamicReducer.register = jest.fn();
        dynamicReducer.register.mockImplementation(a => new a());

        const reducer = registerSliceReducer({ registry: dynamicReducer })(A);

        const destroyStore = () => {};
        storeHolder(destroyStore)();

        expect(reducer).toBeInstanceOf(A);
        expect(dynamicReducer.register).toHaveBeenCalledWith(A);
        expect(store.dispatch).toHaveBeenCalledWith({ type: '@@boilerout/INIT' });
    });

    it('should fail with no args', () => {
        expect(() => registerSliceReducer()).toThrow(/Invalid store object/);
    });

    it('should fail with no dynamic reducer arg', () => {
        const store = {
            dispatch: jest.fn()
        };
        expect(() => registerSliceReducer({ store })).toThrow(/undefined is not a DynamicSliceReducer/);
    });
});
