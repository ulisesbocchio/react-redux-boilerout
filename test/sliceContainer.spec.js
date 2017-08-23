import { sliceContainer, sliceReducer, combineSliceReducers } from '../src';
import { createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

describe('Slice Container Tests', () => {

  it('checks Slice Container creation', () => {

    class ContainerClass {
      static mapSliceStateToProps = s => s;
      static mapDispatchToProps = () => ({});
      static inject = () =>{};
    }

    const SillyComp = ({ message }) => <div id="silly">{message}</div>;
    class SampleReducerClass {}

    const SampleReducer = sliceReducer('sample')(SampleReducerClass);
    const reducer = combineSliceReducers(SampleReducer);
    const store = createStore(reducer);
    const Container = sliceContainer({ slice: 'sample', component: SillyComp })(ContainerClass);

    const providerWrapper = mount(<Provider store={store}><Container /></Provider>);
    expect(providerWrapper).toHaveLength(1);

    const containerWrapper = providerWrapper.find(Container);
    expect(containerWrapper).toHaveLength(1);

    //const componentWrapper = containerWrapper.find(SillyComp);
    //expect(componentWrapper).toHaveLength(1);
  });

  it('should fail no class', () => {
    expect(() => sliceContainer({})()).toThrow(/sliceContainer needs a class/);
  });

});
