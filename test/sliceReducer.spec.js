import { sliceReducer } from '../src'

describe('Slice Reducer Tests', () => {
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
      const reducer = sliceReducer('a')(A);

      expect(reducer).toHaveProperty('slice');
      expect(reducer).toEqual(expect.any(Function));
      expect(reducer.slice).toEqual('a');
    });

  it('checks attributes in created object with class props', () => {
    const reducer = sliceReducer('b')(B);

    expect(reducer).toHaveProperty('slice');
    expect(reducer).toEqual(expect.any(Function));
    expect(reducer.slice).toEqual('b');
  });
});
