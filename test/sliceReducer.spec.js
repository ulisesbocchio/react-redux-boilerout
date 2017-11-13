import { sliceReducer, subscribe } from '../src';

describe('Slice Reducer Tests', () => {
    it('checks attributes in created object', () => {
        class A {
            constructor() {
                this.someField = 0;
            }
            someMethod() {}
            someOtherMethod() {}
        }
        const augmentedReducerClass = sliceReducer('a')(A);
        const reducer = new augmentedReducerClass();

        expect(reducer).toBeInstanceOf(A);
        expect(reducer.slice).toEqual(expect.any(Function));
        expect(reducer.reducer).toEqual(expect.any(Function));
        expect(reducer.getInitialState).toEqual(expect.any(Function));
        expect(reducer.slice()).toEqual('a');
        expect(reducer.reducer()).toEqual(expect.any(Function));
        expect(reducer.getInitialState()).toEqual({});
    });

    it('checks attributes in created object with class props', () => {
        @sliceReducer('b')
        @subscribe({ namespace: 'todos' })
        class B {
            constructor() {
                this.someField = 0;
            }
            @subscribe({ namespace: 'pepe', action: 'someAction' })
            someMethod = () => {};
            someOtherMethod = () => {};
        }

        const reducer = new B();

        expect(reducer).toBeInstanceOf(B);
        expect(reducer.slice).toEqual(expect.any(Function));
        expect(reducer.reducer).toEqual(expect.any(Function));
        expect(reducer.getInitialState).toEqual(expect.any(Function));
        expect(reducer.slice()).toEqual('b');
        expect(reducer._namespace).toEqual('todos');
        expect(reducer.someMethod._namespace).toEqual('pepe');
        expect(reducer.someMethod._action).toEqual('someAction');
        expect(reducer.reducer()).toEqual(expect.any(Function));
        expect(reducer.getInitialState()).toEqual({});
    });

    it('checks sliceReducer gets called with subscribe namespace on class', () => {
        @subscribe({ namespace: 'todos' })
        @sliceReducer('b')
        class B {
            onSomeAction = jest.fn();
        }

        const slice = new B();
        const reducer = slice.reducer();
        slice.onSomeAction.mockImplementation(s => s);
        reducer({}, { type: 'onSomeAction', payload: [1, 2, 3], _namespace: 'todos' });
        expect(slice.onSomeAction).toHaveBeenCalledWith({}, 1, 2, 3);
    });

    it('checks sliceReducer gets called with subscribe namespace on method', () => {
        @sliceReducer('b')
        class B {
            @subscribe({ action: 'onSomeAction', namespace: 'todos' })
            blah = jest.fn();
        }

        const slice = new B();
        const reducer = slice.reducer();
        slice.blah.mockImplementation(s => s);
        reducer({}, { type: 'onSomeAction', payload: [1, 2, 3], _namespace: 'todos' });
        expect(slice.blah).toHaveBeenCalledWith({}, 1, 2, 3);
    });

    it('checks sliceReducer gets called with class subscribe namespace on method', () => {
        @subscribe({ namespace: 'todos' })
        @sliceReducer('b')
        class B {
            @subscribe({ action: 'onSomeAction' })
            blah = jest.fn();
        }

        const slice = new B();
        const reducer = slice.reducer();
        slice.blah.mockImplementation(s => s);
        reducer({}, { type: 'onSomeAction', payload: [1, 2, 3], _namespace: 'todos' });
        reducer({}, { type: 'onSomeAction', payload: [1, 2, 3], _namespace: 'not_the_one_subscribed' });
        expect(slice.blah).toHaveBeenCalledWith({}, 1, 2, 3);
    });

    it('checks sliceReducer gets called only for override subscribe', () => {
        @subscribe({ namespace: 'todos' })
        @sliceReducer('b')
        class B {
            @subscribe({ action: 'onSomeAction', namespace: 'notodo' })
            blah = jest.fn();
        }

        const slice = new B();
        const reducer = slice.reducer();
        slice.blah.mockImplementation(s => s);
        reducer({}, { type: 'onSomeAction', payload: [1, 2, 3], _namespace: 'notodo' });
        reducer({}, { type: 'onSomeAction', payload: [5, 6, 7], _namespace: 'todos' });
        expect(slice.blah).toHaveBeenCalledWith({}, 1, 2, 3);
    });

    it("checks sliceReducer doesn't get called with subscribe namespace on class", () => {
        @subscribe({ namespace: 'todos' })
        @sliceReducer('b')
        class B {
            onSomeAction = jest.fn();
        }

        const slice = new B();
        const reducer = slice.reducer();
        slice.onSomeAction.mockImplementation(s => s);
        reducer({}, { type: 'onSomeAction', payload: [1, 2, 3], _namespace: 'blah' });
        expect(slice.onSomeAction.mock.calls.length).toBe(0);
    });

    it("checks sliceReducer doesn't called with subscribe namespace on method", () => {
        @sliceReducer('b')
        class B {
            @subscribe({ action: 'onSomeAction', namespace: 'todos' })
            blah = jest.fn();
        }

        const slice = new B();
        const reducer = slice.reducer();
        expect(slice.blah._namespace).toEqual('todos');
        expect(slice.blah._action).toEqual('onSomeAction');
        reducer({}, { type: 'onSomeAction', payload: [1, 2, 3], _namespace: 'beep' });
        expect(slice.blah.mock.calls.length).toBe(0);
    });
});
