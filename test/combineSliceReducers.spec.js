import { combineSliceReducers, sliceReducer } from '../src'

describe('Combine Slice Reducers Tests', () => {
  class A {
    static initialState() {return 999}
    one(){return 1}
    two(a){return a}
  }

  class B {
    three(a, b){return a + b}
    four(){return 4}
    onTwo() {return 'magic'}
  }

  class C {
    initialState() {return 666}
  }

  it('checks it returns one reducer', () => {
    const sliceReducers = [
      sliceReducer('a')(A),
      sliceReducer('b')(B)
    ];
    const reducer = combineSliceReducers(sliceReducers);
    expect(reducer).toEqual(expect.any(Function));
  });

  it('checks it fails with invalid reducers', () => {
    const sliceReducers = [
      sliceReducer('a', A),
      sliceReducer('b', B)
    ];
    expect(() => combineSliceReducers(sliceReducers)).toThrowError(/Invalid object passed as action reducer/);
  });

  it('should map state to keys', () => {
    const sliceReducers = [
      sliceReducer('a')(A),
      sliceReducer('b')(B)
    ];
    const reducer = combineSliceReducers(sliceReducers);

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
    const sliceReducers = [
      sliceReducer('a')(A),
      sliceReducer('b')(B)
    ];
    const reducer = combineSliceReducers(sliceReducers);

    let newState = reducer({a:{}, b: {}}, {type: 'one', payload:['a']});
    expect(newState).toEqual({a: 1, b: {}});
    newState = reducer({a:{}, b: {}}, {type: 'one', payload:['a']});
    expect(newState).toEqual({a: 1, b: {}});

  });

  it('should use variant', () => {
    const sliceReducers = [
      sliceReducer('a')(A),
      sliceReducer('b')(B)
    ];
    const reducer = combineSliceReducers(sliceReducers);

    const newState = reducer({a:{}, b: {}}, {type: 'TWO', payload:['a'], variants: ['two', 'onTwo']});
    expect(newState).toEqual({a: 'a', b: 'magic'});
  });

  it('should use initialState', () => {
    const sliceReducers = [
      sliceReducer('a')(A),
      sliceReducer('b')(B)
    ];
    const reducer = combineSliceReducers(sliceReducers);

    const newState = reducer();
    expect(newState).toEqual({a: 999, b: {}});
  });

  it('should use initialState no static', () => {
    const sliceReducers = [
      sliceReducer('a')(A),
      sliceReducer('b')(B),
      sliceReducer('c')(C)
    ];
    const reducer = combineSliceReducers(sliceReducers);

    const newState = reducer();
    expect(newState).toEqual({a: 999, b: {}, c: 666});
  });

});
