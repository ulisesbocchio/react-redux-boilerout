import { actionReducer } from '../src'

describe('Action Reducer Tests', () => {
    class A {
      constructor() {
        this.someField = 0;
      }
      someMethod(){}
      someOtherMethod(){}
    }

    it('checks attributes in created object', () => {
      const reducer = actionReducer('a')(A);

      expect(reducer).toHaveProperty('name');
      expect(reducer).toHaveProperty('clazz');
      expect(reducer).toHaveProperty('reducer');
      expect(reducer).toHaveProperty('methods');

      expect(reducer.name).toEqual('a');
      expect(reducer.clazz).toEqual(A);
      expect(reducer.reducer).toEqual(expect.any(A));
      expect(reducer.selector).toEqual(expect.any(Function));
      expect(reducer.methods).toEqual(['someMethod', 'someOtherMethod']);
    });

  it('checks selector in created object', () => {
    const reducer = actionReducer('a')(A);

    expect(reducer.selector({a: 'hi'})).toEqual('hi');
    expect(reducer.selector({b: 'hi'})).toBeUndefined();
  });
});
