import connectSlice from './connectSlice';

export default function sliceContainer({slice, actions, component}) {
  return (containerClass) => {

    if (typeof containerClass !== 'function') {
      throw new Error('containerClass needs to be a class');
    }

    const container = new containerClass();
    const inject = container.inject && container.inject();
    const mapSliceStateToProps = container.mapSliceStateToProps && container.mapSliceStateToProps.bind(container);
    const mapDispatchToProps = container.mapDispatchToProps && container.mapDispatchToProps.bind(container);

    return connectSlice({slice, actions, inject}, mapSliceStateToProps, mapDispatchToProps)(component);
  };
}
