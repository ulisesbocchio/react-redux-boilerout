import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { hoistComponentBehavior } from './hoister';

export default function connectSlice(
    { slice: sliceNameOrSliceReducer, actions, inject, hoist },
    mapSliceStateToProps,
    mapDispatchToProps,
    mergeProps,
    connectOptions
) {
    return targetComponent => {
        let component = targetComponent;

        if (hoist && component) {
            component = hoistComponentBehavior(component, hoist);
        }

        let slice = null;
        if (typeof sliceNameOrSliceReducer === 'string') {
            slice = sliceNameOrSliceReducer;
        } else if (sliceNameOrSliceReducer && typeof sliceNameOrSliceReducer.slice === 'function') {
            slice = sliceNameOrSliceReducer.slice();
        } else {
            throw new Error("Invalid 'slice' arg. String or SliceReducer required");
        }

        const mapStateToProps = (state, ownProps) => {
            return Object.assign(
                {},
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

        return connect(mapStateToPropsCreator, mapDispatchToPropsCreator, mergeProps, connectOptions)(component);
    };
}
