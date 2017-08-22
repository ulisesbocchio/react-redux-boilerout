import combineSliceReducers from './combineSliceReducers';

export default class DynamicSliceReducer {
  constructor() {
    this.sliceReducers = [];
    this.combinedSlicesReducer = s => s;
  }

  register(sliceReducer) {
    const instance = new sliceReducer();
    this.sliceReducers.push(instance);
    this.combinedSlicesReducer = combineSliceReducers(...this.sliceReducers);
    return instance;
  }

  reducer() {
    return (state, action) => {
      return this.combinedSlicesReducer(state, action);
    }
  }
}
