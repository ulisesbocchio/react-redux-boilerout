import { actionReducer } from '../src'

describe('Action Reducer Tests', () => {
    class A {
      constructor() {
        this.someField = 0;
      }
      someMethod(){}
      someOtherMethod(){}
    }

  class B {
    constructor() {
      this.someField = 0;
    }
    someMethod = () => {};
    someOtherMethod = () => {};
  }

    it('checks attributes in created object', () => {
      const reducer = actionReducer('a')(A);

      expect(reducer).toHaveProperty('slice');
      expect(reducer).toEqual(expect.any(Function));
      expect(reducer.slice).toEqual('a');
    });

  it('checks attributes in created object with class props', () => {
    const reducer = actionReducer('b')(B);

    expect(reducer).toHaveProperty('slice');
    expect(reducer).toEqual(expect.any(Function));
    expect(reducer.slice).toEqual('b');
  });
});
