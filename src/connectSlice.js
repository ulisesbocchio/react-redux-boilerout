import { connect } from 'react-redux';
import { createSelector } from 'reselect';

export default function connectSlice({slice, actions, inject}, mapSliceStateToProps, mapDispatchToProps) {
  return (component) => {
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

    const mapStateToPropsCreator = () => createSelector([(s, p) => s[slice], (s, p) => p], mapStateToProps);
    //eslint-disable-next-line no-unused-vars
    const mapDispatchToPropsCreator = () => createSelector([(d, p) => d, (d, p) => p], mapActualDispatchToProps);

    return connect(
      mapStateToPropsCreator,
      mapDispatchToPropsCreator
    )(component);
  };
}
