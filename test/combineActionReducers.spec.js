import { combineActionReducers, actionReducer } from '../src'

describe('Combine Action Reducers Tests', () => {
  class A {
    initialState() {return 999}
    one(){return 1}
    two(a){return a}
  }

  class B {
    three(a, b){return a + b}
    four(){return 4}
    onTwo() {return 'magic'}
  }

  it('checks it returns one reducer', () => {
    const actionReducers = [
      actionReducer('a')(A),
      actionReducer('b')(B)
    ];
    const reducer = combineActionReducers(actionReducers);
    expect(reducer).toEqual(expect.any(Function));
  });

  it('checks it fails with invalid reducers', () => {
    const actionReducers = [
      actionReducer('a', A),
      actionReducer('b', B)
    ];
    expect(() => combineActionReducers(actionReducers)).toThrowError(/Invalid object passed as action reducer/);
  });

  it('should map state to keys', () => {
    const actionReducers = [
      actionReducer('a')(A),
      actionReducer('b')(B)
    ];
    const reducer = combineActionReducers(actionReducers);

    let newState = reducer({a:{}, b: {}}, {type: 'one', payload:['a']});
    expect(newState).toEqual({a: 1, b: {}});

    newState = reducer({a:{}, b: {}}, {type: 'two', payload:['a']});
    expect(newState).toEqual({a: 'a', b: {}});

    newState = reducer({a:{}, b: {}}, {type: 'three', payload:[1, 2]});
    expect(newState).toEqual({a: {}, b: 3});

    newState = reducer({a:{}, b: {}}, {type: 'four', payload:[1, 2]});
    expect(newState).toEqual({a: {}, b: 4});
  });

  it('should cover else branch on cache logic when call same action twice', () => {
    const actionReducers = [
      actionReducer('a')(A),
      actionReducer('b')(B)
    ];
    const reducer = combineActionReducers(actionReducers);

    let newState = reducer({a:{}, b: {}}, {type: 'one', payload:['a']});
    expect(newState).toEqual({a: 1, b: {}});
    newState = reducer({a:{}, b: {}}, {type: 'one', payload:['a']});
    expect(newState).toEqual({a: 1, b: {}});

  });

  it('should use variant', () => {
    const actionReducers = [
      actionReducer('a')(A),
      actionReducer('b')(B)
    ];
    const reducer = combineActionReducers(actionReducers);

    const newState = reducer({a:{}, b: {}}, {type: 'TWO', payload:['a'], variants: ['two', 'onTwo']});
    expect(newState).toEqual({a: 'a', b: 'magic'});
  });

  it('should use initialState', () => {
    const actionReducers = [
      actionReducer('a')(A),
      actionReducer('b')(B)
    ];
    const reducer = combineActionReducers(actionReducers);

    const newState = reducer();
    expect(newState).toEqual({a: 999, b: {}});
  });

});
