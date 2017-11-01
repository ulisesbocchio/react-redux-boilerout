import { subscribe } from '../src';

describe('Subscribe decorator Tests', () => {
    it('checks namespace attribute in decorated class', () => {
        @subscribe({ namespace: 'todos' })
        class A {
            constructor() {
                this.someField = 0;
            }
            @subscribe({ namespace: 'pepe', action: 'doSomething' })
            someMethod() {}
            someOtherMethod() {}
        }
        const decorated = new A();
        expect(decorated._namespace).toEqual('todos');
    });

    it('checks namespace attribute in decorated method', () => {
        @subscribe({ namespace: 'todos' })
        class A {
            constructor() {
                this.someField = 0;
            }
            @subscribe({ namespace: 'pepe', action: 'doSomething' })
            someMethod() {}
            someOtherMethod() {}
        }
        const decorated = new A();
        expect(decorated.someMethod._namespace).toEqual('pepe');
        expect(decorated.someMethod._action).toEqual('doSomething');
    });

    it('checks namespace attribute in decorated class property', () => {
        class B {
            @subscribe({ namespace: 'pepe', action: 'doSomethingElse' })
            constMethod = () => 'a';
        }
        const decorated = new B();
        expect(decorated.constMethod._namespace).toEqual('pepe');
        expect(decorated.constMethod._action).toEqual('doSomethingElse');
    });

    it('should throw decorating subscribe with no namespace on class', () => {
        expect(() => {
            @subscribe({ action: 'doSomething' })
            // eslint-disable-next-line no-unused-vars
            class B {}
        }).toThrow('namespace is required on class decorator');
    });

    it('should throw decorating subscribe with action on class', () => {
        expect(() => {
            @subscribe({ namespace: 'pepe', action: 'doSomething' })
            // eslint-disable-next-line no-unused-vars
            class C {}
        }).toThrow('action param is only allowed on class members');
    });

    it('should throw decorating subscribe with no params on class', () => {
        expect(() => {
            @subscribe()
            // eslint-disable-next-line no-unused-vars
            class D {}
        }).toThrow('namespace is required on class decorator');
    });

    it('should throw decorating subscribe with no params on method', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-vars
            class E {
                @subscribe()
                method() {}
            }
        }).toThrow('namespace and/or action are required on member decorator');
    });
});
