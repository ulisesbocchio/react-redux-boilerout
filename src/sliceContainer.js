import connectSlice from './connectSlice';

export default function sliceContainer({slice, actions, component}) {
  return (containerClass) => {

    if (typeof containerClass !== 'function') {
      throw new Error('sliceContainer needs a class');
    }

    const inject = containerClass.inject && containerClass.inject();
    const mapSliceStateToProps = containerClass.mapSliceStateToProps && containerClass.mapSliceStateToProps.bind(containerClass);
    const mapDispatchToProps = containerClass.mapDispatchToProps && containerClass.mapDispatchToProps.bind(containerClass);

    return connectSlice({ slice, actions, inject }, mapSliceStateToProps, mapDispatchToProps)(component);
  };
}
