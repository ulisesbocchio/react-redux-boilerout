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
    const augmentedReducerClass = sliceReducer('b')(B);
    const reducer = new augmentedReducerClass();

    expect(reducer).toBeInstanceOf(B);
    expect(reducer.slice).toEqual(expect.any(Function));
    expect(reducer.reducer).toEqual(expect.any(Function));
    expect(reducer.getInitialState).toEqual(expect.any(Function));
    expect(reducer.slice()).toEqual('b');
    expect(reducer.reducer()).toEqual(expect.any(Function));
    expect(reducer.getInitialState()).toEqual({});
  });
});
