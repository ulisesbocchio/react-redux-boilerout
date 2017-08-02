import { actionReducersEnhancer, actionReducer, generateActionCreators } from '../src';
import { createStore, applyMiddleware, compose } from 'redux';

describe('Action Reducers Enhancer Tests', () => {
  class A {
    constructor() {
      this.someField = 0;
    }
    someMethod(){}
    someOtherMethod(){}
  }

  it('checks enhancer is created correctly', () => {
    const enhancer = actionReducersEnhancer();
    expect(enhancer).toEqual(expect.any(Function));
  });
  it('checks enhancer returns a store', () => {
    const enhancer = actionReducersEnhancer();
    const actionReducers = [actionReducer('a')(A)];
    const actionCreators = [generateActionCreators('start', 'stop')];
    const store = createStore({ actionReducers, actionCreators }, enhancer);
    expect(store).toHaveProperty('dispatch');
    expect(store).toHaveProperty('getState');
    expect(store.dispatch).toEqual(expect.any(Function));
    expect(store.getState).toEqual(expect.any(Function));
  });

  it('checks enhancer throws when no first argument', () => {
    const enhancer = actionReducersEnhancer();
    expect(() => createStore(null, enhancer)).toThrowError(/first argument to be an object/);
  });

  it('checks enhancer throws when no actionReducers', () => {
    const enhancer = actionReducersEnhancer();
    const actionReducers = [];
    expect(() => createStore({ actionReducers }, enhancer)).toThrowError(/at least one action reducer/);
    expect(() => createStore({}, enhancer)).toThrowError(/at least one action reducer/);
  });

});

