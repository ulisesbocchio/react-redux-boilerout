import { boileroutEnhancer, sliceReducer, generateActionDispatchers } from '../src';
import { createStore } from 'redux';

describe('Boilerout Enhancer Tests', () => {
  class A {
    constructor() {
      this.someField = 0;
    }
    someMethod(){}
    someOtherMethod(){}
  }

  it('checks enhancer is created correctly', () => {
    const enhancer = boileroutEnhancer();
    expect(enhancer).toEqual(expect.any(Function));
  });
  it('checks enhancer returns a store', () => {
    const enhancer = boileroutEnhancer();
    const sliceReducers = [sliceReducer('a')(A)];
    const actionCreators = [generateActionDispatchers('start', 'stop')];
    const store = createStore({ sliceReducers, actionCreators }, enhancer);
    expect(store).toHaveProperty('dispatch');
    expect(store).toHaveProperty('getState');
    expect(store.dispatch).toEqual(expect.any(Function));
    expect(store.getState).toEqual(expect.any(Function));
  });

  it('checks enhancer throws when no first argument', () => {
    const enhancer = boileroutEnhancer();
    expect(() => createStore(null, enhancer)).toThrowError(/first argument to be an object/);
  });

  it('checks enhancer throws when no sliceReducers', () => {
    const enhancer = boileroutEnhancer();
    const sliceReducers = [];
    expect(() => createStore({ sliceReducers }, enhancer)).toThrowError(/at least one action reducer/);
    expect(() => createStore({}, enhancer)).toThrowError(/at least one action reducer/);
  });

});

