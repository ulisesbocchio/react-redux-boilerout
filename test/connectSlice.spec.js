import { sliceReducer, generateActionDispatchers, connectSlice, combineSliceReducers, subscribe } from '../src';
import { createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

beforeAll(() => {
    configure({ adapter: new Adapter() });
});

describe('Connect Slice Reducers Tests', () => {
    it('checks connectSlice creates a container which renders correctly', () => {
        const SillyComp = ({ message }) => <div id="silly">{message}</div>;
        class SampleReducerClass {}

        const SampleReducer = sliceReducer('sample')(SampleReducerClass);
        const reducer = combineSliceReducers(SampleReducer);
        const store = createStore(reducer);
        const Container = connectSlice({
            slice: 'sample'
        })(SillyComp);

        const providerWrapper = mount(
            <Provider store={store}>
                <Container />
            </Provider>
        );
        expect(providerWrapper).toHaveLength(1);

        const containerWrapper = providerWrapper.find(Container);
        expect(containerWrapper).toHaveLength(1);

        const componentWrapper = containerWrapper.find(SillyComp);
        expect(componentWrapper).toHaveLength(1);
    });

    it('checks connectSlice creates a container which renders correctly using a reducer instance', () => {
        const SillyComp = ({ message }) => <div id="silly">{message}</div>;
        class SampleReducerClass {}

        const SampleReducer = sliceReducer('sample')(SampleReducerClass);
        const reducer = combineSliceReducers(SampleReducer);
        const store = createStore(reducer);
        const Container = connectSlice({
            slice: new SampleReducer()
        })(SillyComp);

        const providerWrapper = mount(
            <Provider store={store}>
                <Container />
            </Provider>
        );
        expect(providerWrapper).toHaveLength(1);

        const containerWrapper = providerWrapper.find(Container);
        expect(containerWrapper).toHaveLength(1);

        const componentWrapper = containerWrapper.find(SillyComp);
        expect(componentWrapper).toHaveLength(1);
    });

    it('checks connectSlice fails if no slice is passed', () => {
        const SillyComp = ({ message }) => <div id="silly">{message}</div>;
        class SampleReducerClass {}

        const SampleReducer = sliceReducer('sample')(SampleReducerClass);
        const reducer = combineSliceReducers(SampleReducer);
        createStore(reducer);
        expect(() =>
            connectSlice({
                slice: null
            })(SillyComp)
        ).toThrow(/Invalid 'slice'/);
    });

    it('checks connectSlice injects regular initialState correctly', () => {
        const SillyComp = ({ message }) => <div id="silly">{message}</div>;
        class SampleReducerClass {
            initialState = () => ({ message: "what's up?", started: false });
        }

        const SampleReducer = sliceReducer('sample')(SampleReducerClass);
        const reducer = combineSliceReducers(SampleReducer);
        const store = createStore(reducer);

        const Container = connectSlice({
            slice: 'sample'
        })(SillyComp);

        const providerWrapper = mount(
            <Provider store={store}>
                <Container />
            </Provider>
        );
        expect(providerWrapper.find('#silly').text()).toBe(new SampleReducerClass().initialState().message);
    });

    it('checks connectSlice injects static initialState correctly', () => {
        const SillyComp = ({ message }) => <div id="silly">{message}</div>;
        class SampleReducerClass {
            static initialState = () => ({ message: "what's up?", started: false });
        }

        const SampleReducer = sliceReducer('sample')(SampleReducerClass);
        const reducer = combineSliceReducers(SampleReducer);
        const store = createStore(reducer);

        const Container = connectSlice({
            slice: 'sample'
        })(SillyComp);

        const providerWrapper = mount(
            <Provider store={store}>
                <Container />
            </Provider>
        );
        expect(providerWrapper.find('#silly').text()).toBe(SampleReducerClass.initialState().message);
    });

    it('checks wrapped components get updated when action dispatchers are executed', () => {
        const SillyComp = ({ message }) => <div id="silly">{message}</div>;
        @subscribe({ namespace: 'silly' })
        class SampleReducerClass {
            start = () => ({ message: 'hello', started: true });
            stop() {
                return { message: 'bye', started: false };
            }
            nothing = state => state;
        }

        const SampleReducer = sliceReducer('sample')(SampleReducerClass);
        const reducer = combineSliceReducers(SampleReducer);
        const store = createStore(reducer);
        const SampleActions = generateActionDispatchers({
            dispatch: store.dispatch,
            options: { namespace: 'silly' },
            actions: ['start', 'stop', 'nothing']
        });

        const Container = connectSlice({
            slice: 'sample'
        })(SillyComp);

        const providerWrapper = mount(
            <Provider store={store}>
                <Container />
            </Provider>
        );
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

        const SampleReducer = sliceReducer('sample')(SampleReducerClass);
        const reducer = combineSliceReducers(SampleReducer);
        const store = createStore(reducer);
        const SampleActions = generateActionDispatchers({ dispatch: store.dispatch, actions: ['meh'] });

        const Container = connectSlice({ slice: 'sample', actions: SampleActions }, (slice, props) => ({
            message: slice.message + 'something else'
        }))(SillyComp);

        const providerWrapper = mount(
            <Provider store={store}>
                <Container />
            </Provider>
        );
        const sillyDOM = providerWrapper.find('#silly');

        expect(sillyDOM.text()).toBe(new SampleReducerClass().initialState().message + 'something else');
    });

    it('checks mapDispatchToProps works as expected', () => {
        const SillyComp = ({ message }) => <div id="silly">{message}</div>;
        class SampleReducerClass {
            start = () => ({ message: 'hello', started: true });
        }

        const SampleReducer = sliceReducer('sample')(SampleReducerClass);
        const reducer = combineSliceReducers(SampleReducer);
        const store = createStore(reducer);
        const SampleActions = generateActionDispatchers({ dispatch: store.dispatch, actions: ['meh'] });

        const Container = connectSlice(
            { slice: 'sample', actions: SampleActions },
            (slice, props) => slice,
            (dispatch, props) => {
                dispatch({ type: 'start', payload: [] });
                return props;
            }
        )(SillyComp);

        const providerWrapper = mount(
            <Provider store={store}>
                <Container />
            </Provider>
        );
        const sillyDOM = providerWrapper.find('#silly');

        expect(sillyDOM.text()).toBe(new SampleReducerClass().start().message);
    });

    it('checks actions get correctly injected into component', () => {
        const SillyComp = ({ message, start }) => (
            <div id="silly" onClick={start}>
                {message}
            </div>
        );
        class SampleReducerClass {
            start = () => ({ message: 'hello', started: true });
        }

        const SampleReducer = sliceReducer('sample')(SampleReducerClass);
        const reducer = combineSliceReducers(SampleReducer);
        const store = createStore(reducer);
        const SampleActions = generateActionDispatchers({ dispatch: store.dispatch, actions: ['start'] });

        const Container = connectSlice({ slice: 'sample', actions: SampleActions })(SillyComp);

        const providerWrapper = mount(
            <Provider store={store}>
                <Container />
            </Provider>
        );
        const sillyDOM = providerWrapper.find('#silly');
        sillyDOM.simulate('click');

        expect(sillyDOM.text()).toBe(new SampleReducerClass().start().message);
    });

    it('checks component only re-render when their slice or props changed', () => {
        class SillyComp1 extends React.Component {
            render() {
                const { message, start } = this.props;
                return (
                    <div>
                        <div id="silly1" onClick={start}>
                            {message}
                        </div>
                        <Container2 />
                    </div>
                );
            }
        }
        class SillyComp2 extends React.Component {
            render() {
                const { message } = this.props;
                return <div id="silly2">{message}</div>;
            }
        }

        class SampleReducerClass1 {
            start = () => ({ message: 'hello', started: true });
        }
        class SampleReducerClass2 {}

        const SampleReducer1 = sliceReducer('sample1')(SampleReducerClass1);
        const SampleReducer2 = sliceReducer('sample2')(SampleReducerClass2);
        const reducer = combineSliceReducers(SampleReducer1, SampleReducer2);
        const store = createStore(reducer);
        const SampleActions = generateActionDispatchers({ dispatch: store.dispatch, actions: ['start'] });

        const Container1 = connectSlice({ slice: 'sample1', actions: SampleActions })(SillyComp1);

        const Container2 = connectSlice({ slice: 'sample2' })(SillyComp2);

        const silly1RenderSpy = jest.spyOn(SillyComp1.prototype, 'render');
        const silly2RenderSpy = jest.spyOn(SillyComp2.prototype, 'render');
        expect(silly1RenderSpy).toHaveBeenCalledTimes(0);
        expect(silly2RenderSpy).toHaveBeenCalledTimes(0);

        const providerWrapper = mount(
            <Provider store={store}>
                <Container1 />
            </Provider>
        );
        expect(silly1RenderSpy).toHaveBeenCalledTimes(1);
        expect(silly2RenderSpy).toHaveBeenCalledTimes(1);

        providerWrapper.find('#silly1').simulate('click');
        expect(silly1RenderSpy).toHaveBeenCalledTimes(2);
        expect(silly2RenderSpy).toHaveBeenCalledTimes(1);
    });
});
