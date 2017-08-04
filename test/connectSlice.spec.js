import { boileroutEnhancer, sliceReducer, generateActionDispatchers, connectSlice } from '../src';
import { createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

describe('Connect Slice Reducers Tests', () => {
  it('checks connectSlice creates a container which renders correctly', () => {
    const SillyComp = ({ message }) => <div id="silly">{message}</div>;
    class SampleReducerClass {}

    const enhancer = boileroutEnhancer();
    const SampleReducer = sliceReducer('sample')(SampleReducerClass);
    const SampleActions = generateActionDispatchers();

    const sliceReducers = [SampleReducer];
    const actionDispatchers = [SampleActions];
    const store = createStore({ sliceReducers, actionDispatchers }, enhancer);

    const Container = connectSlice({
      slice: 'sample'
    })(SillyComp);

    const providerWrapper = mount(<Provider store={store}><Container /></Provider>);
    expect(providerWrapper).toHaveLength(1);

    const containerWrapper = providerWrapper.find(Container);
    expect(containerWrapper).toHaveLength(1);

    const componentWrapper = containerWrapper.find(SillyComp);
    expect(componentWrapper).toHaveLength(1);
  });

  it('checks connectSlice injects regular initialState correctly', () => {
    const SillyComp = ({ message }) => <div id="silly">{message}</div>;
    class SampleReducerClass {
      initialState = () => ({ message: "what's up?", started: false });
    }

    const enhancer = boileroutEnhancer();
    const SampleReducer = sliceReducer('sample')(SampleReducerClass);
    const SampleActions = generateActionDispatchers();

    const sliceReducers = [SampleReducer];
    const actionDispatchers = [SampleActions];
    const store = createStore({ sliceReducers, actionDispatchers }, enhancer);

    const Container = connectSlice({
      slice: 'sample'
    })(SillyComp);

    const providerWrapper = mount(<Provider store={store}><Container /></Provider>);
    expect(providerWrapper.find('#silly').text()).toBe(new SampleReducerClass().initialState().message);
  });

  it('checks connectSlice injects static initialState correctly', () => {
    const SillyComp = ({ message }) => <div id="silly">{message}</div>;
    class SampleReducerClass {
      static initialState = () => ({ message: "what's up?", started: false });
    }

    const enhancer = boileroutEnhancer();
    const SampleReducer = sliceReducer('sample')(SampleReducerClass);
    const SampleActions = generateActionDispatchers();

    const sliceReducers = [SampleReducer];
    const actionDispatchers = [SampleActions];
    const store = createStore({ sliceReducers, actionDispatchers }, enhancer);

    const Container = connectSlice({
      slice: 'sample'
    })(SillyComp);

    const providerWrapper = mount(<Provider store={store}><Container /></Provider>);
    expect(providerWrapper.find('#silly').text()).toBe(SampleReducerClass.initialState().message);
  });

  it('checks wrapped components get updated when action dispatchers are executed', () => {
    const SillyComp = ({ message }) => <div id="silly">{message}</div>;
    class SampleReducerClass {
      start = () => ({ message: 'hello', started: true });
      stop() {
        return { message: 'bye', started: false };
      }
      nothing = state => state;
    }

    const enhancer = boileroutEnhancer();
    const SampleReducer = sliceReducer('sample')(SampleReducerClass);
    const SampleActions = generateActionDispatchers('start', 'stop', 'nothing');

    const sliceReducers = [SampleReducer];
    const actionDispatchers = [SampleActions];
    const store = createStore({ sliceReducers, actionDispatchers }, enhancer);

    const Container = connectSlice({
      slice: 'sample'
    })(SillyComp);

    const providerWrapper = mount(<Provider store={store}><Container /></Provider>);
    const sillyDOM = providerWrapper.find('#silly');
    const sampleReducerInstance = new SampleReducerClass();

    expect(sillyDOM.text()).toBe('');
    SampleActions.start();
    expect(sillyDOM.text()).toBe(sampleReducerInstance.start().message);
    SampleActions.stop();
    expect(sillyDOM.text()).toBe(sampleReducerInstance.stop().message);
    SampleActions.nothing();
    expect(sillyDOM.text()).toBe(sampleReducerInstance.stop().message);
  });

  it('checks mapSlicesToProps works as expected', () => {
    const SillyComp = ({ message }) => <div id="silly">{message}</div>;
    class SampleReducerClass {
      initialState = () => ({ message: "what's up?", started: false });
    }

    const enhancer = boileroutEnhancer();
    const SampleReducer = sliceReducer('sample')(SampleReducerClass);
    const SampleActions = generateActionDispatchers();

    const sliceReducers = [SampleReducer];
    const actionDispatchers = [SampleActions];
    const store = createStore({ sliceReducers, actionDispatchers }, enhancer);

    const Container = connectSlice(
      { slice: 'sample', actions: SampleActions },
      (slice, props) => ({ message: slice.message + 'something else'})
    )(SillyComp);

    const providerWrapper = mount(<Provider store={store}><Container /></Provider>);
    const sillyDOM = providerWrapper.find('#silly');

    expect(sillyDOM.text()).toBe(new SampleReducerClass().initialState().message + 'something else');
  });

  it('checks mapDispatchToProps works as expected', () => {
    const SillyComp = ({ message }) => <div id="silly">{message}</div>;
    class SampleReducerClass {
      start = () => ({ message: 'hello', started: true });
    }

    const enhancer = boileroutEnhancer();
    const SampleReducer = sliceReducer('sample')(SampleReducerClass);
    const SampleActions = generateActionDispatchers();

    const sliceReducers = [SampleReducer];
    const actionDispatchers = [SampleActions];
    const store = createStore({ sliceReducers, actionDispatchers }, enhancer);

    const Container = connectSlice(
      { slice: 'sample', actions: SampleActions },
      (slice, props) => slice,
      (dispatch, props) => {
        dispatch({ type: 'start', payload: [] });
        return props;
      }
    )(SillyComp);

    const providerWrapper = mount(<Provider store={store}><Container /></Provider>);
    const sillyDOM = providerWrapper.find('#silly');

    expect(sillyDOM.text()).toBe(new SampleReducerClass().start().message);
  });
});
