import { actionReducersEnhancer, actionReducer, generateActionDispatchers, connectSlice } from '../src';
import { createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

const SillyComp = ({ start, stop,  started, message }) => (
  <div
    onClick={() => started ? stop() : start()}
  >
    {message}
  </div>
);

describe('Connect Action Reducers Tests', () => {
  class A {
    initialState = () => ({message: 'what\'s up?', started: false});
    start = () => ({message: 'hello', started: true});
    stop = () => ({message: 'bye', started: false});
    nothing = state => state;
  }

  it('checks connectSlice creates component', () => {
    const enhancer = actionReducersEnhancer();
    const aReducer = actionReducer('a')(A);
    const actionReducers = [aReducer];
    const theActions = generateActionDispatchers('start', 'stop');
    const actionCreators = [theActions];
    const store = createStore({ actionReducers, actionCreators }, enhancer);

    const Container = connectSlice({
        slice: 'a',
        actions: theActions
      },
      (s, p) => p
    )(SillyComp);

    const wrapper = mount(<Provider store={store}><Container/></Provider>);
    expect(wrapper).toHaveLength(1);

  });
});

