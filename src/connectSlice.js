import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { hoistClassBehavior, hoistFunctionalBehavior } from './hoister';
import React from 'react';

export default function connectSlice({slice: sliceNameOrSliceReducer, actions, inject, hoist}, mapSliceStateToProps, mapDispatchToProps) {
  return (targetComponent) => {

    let component = targetComponent;

    if (hoist && component) {
      if (component.prototype instanceof React.Component) {
        component = hoistClassBehavior(component, hoist);
      } else if (typeof component === 'function') {
        component = hoistFunctionalBehavior(component, hoist);
      }
    }

    let slice = null;
    if (typeof sliceNameOrSliceReducer === 'string') {
      slice = sliceNameOrSliceReducer;
    } else if (sliceNameOrSliceReducer && typeof sliceNameOrSliceReducer.slice === 'function') {
      slice = sliceNameOrSliceReducer.slice();
    } else {
      throw new Error('Invalid \'slice\' arg. String or SliceReducer required');
    }

    const mapStateToProps = (state, ownProps) => {
      return Object.assign({},
        actions,
        inject,
        mapSliceStateToProps ? mapSliceStateToProps(state, ownProps) : state
      );
    };

    const mapActualDispatchToProps = (dispatch, ownProps) => {
      return mapDispatchToProps ? mapDispatchToProps(dispatch, ownProps) : {};

    };

    const mapStateToPropsCreator = () => createSelector([(s, p) => s && s[slice], (s, p) => p], mapStateToProps);
    //eslint-disable-next-line no-unused-vars
    const mapDispatchToPropsCreator = () => createSelector([(d, p) => d, (d, p) => p], mapActualDispatchToProps);

    return connect(
      mapStateToPropsCreator,
      mapDispatchToPropsCreator
    )(component);
  };
}
