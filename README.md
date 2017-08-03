[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![CDNJS version][cdnjs-svg]][npm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Coverage Issues Status][coverage-issues-image]][coverage-issues-url]

[![Dependency Status][daviddm-image]][daviddm-url]
[![Dev Dependency Status][daviddm-dev-image]][daviddm-dev-url]
[![Peer Dependency Status][daviddm-peer-image]][daviddm-dev-url]

[![Weekly Downloads][downloads-week-svg]][npm-url]
[![Monthly Downloads][downloads-month-svg]][npm-url]
[![Monthly Downloads][downloads-year-svg]][npm-url]
[![Total Downloads][downloads-total-svg]][npm-url]

[![Github Issues][issues-image]][issues-url]
[![Pending Pull-Requests][pr-image]][pr-url]
[![License][license-image]][license-url]
[![Join the chat][gitter-image]][gitter-url]

# react-redux-boilerout

Boiler Plate eliminator for React projects using Redux

## How to use?

### Install

```bash
yarn add react-redux-boilerout
```
or
```bash
npm install react-redux-boilerout
```

### No Need to define action creator boilerplate, simply do:

`TodoActions.js`
```js
import { generateActionDispatchers } from 'react-redux-boilerout';

export default generateActionDispatchers(
    'setVisibilityFilter',
    'addTodo',
    'toggleTodo'
);
```
Action dispatchers are created automatically for specified action names so you can do:

```js
import TodoActions from './TodoActions';

TodoActions.addTodo('buy beer');
TodoActions.toggleTodo(1);
TodoActions.setVisibilityFilter('SHOW_ALL');
```

The Actions dispatched by this dispatchers have the format:

```js
{
    type: 'setVisibilityFilter',
    payload: ['SHOW_ALL']
}
```

Redux's `dispatch` function is bound automatically also.

### Forget about reducer functions and `combineReducers`

Simply create reducer classes with action listeners

`TodosReducer.js`
```js
import { actionReducer } from 'react-redux-boilerout';

class TodosReducer {
    constructor() {
        this.lastId = 0;
    }

    static initialState() {
        return {
            items: [],
            filter: 'SHOW_ALL'
        };
    }

    addTodo(text, state) {
        const items = [...state.items, {
            id: this.lastId++,
            text,
            completed: false
        }];
        return { ...state, items }
    }

    setVisibilityFilter(filter, state) {
        return { ...state, filter }
    }

    toggleTodo(id, state) {
        const items = [...state.items
            .map(item => item.id === id ? {...item, ...{ completed: !item.completed }} : item)];
        return { ...state, items }
    }
}

export default actionReducer('todos')(TodosReducer);

```
And don't forget to export using the `actionReducer` HOF for which the first call receives the store subtree name that
it will listen to, just like you would with `combineReducers` and on the second call provide the class being used as actions
reducer.
The initial state of the state subtree is defined with the special function `initialState`.

With an empty `preloadedState`, after calling initial state of this reducer, the entire app state would look like this:

```js
{
    todos: {
        items: [],
        filter: 'SHOW_ALL'
    }
}
```
And after calling `TodosActions.setVisibilityFilter('ACTIVCE')`, `TodosActions.addTodo('Buy Beer')`, `TodosActions.toggleTodo(1)`
it would look like this:
```js
 {
     todos: {
         items: [{
             id: 1,
             text: 'Buy Beer',
             completed: true
         }],
         filter: 'ACTIVE'
     }
 }
```
### With action dispatchers and action reducers in place, you can now connect them to your components

Using a similar approach to `redux`'s `connect` HOC, `react-redux-boilerout` provides `connectActionReducer` to connect
your component to a specific subtree of the state directly, without worrying about doing the selection with boilerplate.

`TodoListContainer.js`
```js
import { connectActionReducer } from 'react-redux-boilerout';
import TodosActions from './TodosActions';
import TodoList from './TodoList';
import TodosReducer from './TodosReducer';

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
        default:
            throw new Error('Unknown filter: ' + filter)
    }
};

const mapStoreStateToProps = (state) => ({
    todos: getVisibleTodos(state.items, state.filter)
});

const inject = {};

const VisibleTodoList = connectActionReducer({
        actionReducer: TodosReducer,
        actions: TodosActions,
        inject
    },
    mapStoreStateToProps
)(TodoList);

export default VisibleTodoList
```


### Finally, initialize `redux` with a special enhancer that binds it all together

You need to provide `actionReducersEnhancer` an object with `actionReducers` and `actionDispatcher` so they can be
properly bound to the store. But you don't pass those to the enhancer itself, instead, you pass them as first
argument to `redux`'s `createStore` function where you would put your main reducer.

`reduxStore.js`
```js
import TodosReducer from './TodosReducer';
import TodosActions from '../actions/TodosActions';
import { createStore } from 'redux';
import { actionReducersEnhancer } from 'react-redux-boilerout';

const actionReducers = [
    TodosReducer
];

const actionDispatchers = [
    TodosActions
];

const enhancer = actionReducersEnhancer();

export const store = createStore({
    actionReducers,
    actionDispatchers
}, enhancer);
```
You can also use `redux`'s compose to add any other enhancer/middleware like:

```js
const enhancer = compose(
    actionReducersEnhancer(),
    applyMiddleware(
        logger,
        crashReporter
    )
);
```

And inject it into your `Provider`

`AppProvider.js`
```js
import React from 'react'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './reduxStore'

const AppProvider = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default AppProvider;
```

## License

MIT ©2017 [Ulises Bocchio](http://github.com/ulisesbocchio)

[npm-url]: https://npmjs.org/package/react-redux-boilerout
[travis-image]: https://travis-ci.org/ulisesbocchio/react-redux-boilerout.svg?branch=master
[travis-url]: https://travis-ci.org/ulisesbocchio/react-redux-boilerout
[daviddm-image]: https://img.shields.io/david/ulisesbocchio/react-redux-boilerout.svg
[daviddm-url]: 	https://img.shields.io/david/ulisesbocchio/react-redux-boilerout
[daviddm-peer-image]: 	https://img.shields.io/david/peer/ulisesbocchio/react-redux-boilerout.svg
[daviddm-peer-url]:https://david-dm.org/ulisesbocchio/react-redux-boilerout#info=peerDependencies
[daviddm-dev-image]: https://img.shields.io/david/dev/ulisesbocchio/react-redux-boilerout.svg
[daviddm-dev-url]:https://david-dm.org/ulisesbocchio/react-redux-boilerout#info=devDependencies
[codeclimate-image]: https://img.shields.io/codeclimate/github/ulisesbocchio/react-redux-boilerout.svg
[codeclimate-url]: https://codeclimate.com/github/ulisesbocchio/react-redux-boilerout
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/ulisesbocchio/react-redux-boilerout.svg
[coverage-url]: https://codeclimate.com/github/ulisesbocchio/react-redux-boilerout/coverage

[coverage-issues-image]: https://img.shields.io/codeclimate/issues/github/ulisesbocchio/react-redux-boilerout.svg
[coverage-issues-url]: https://codeclimate.com/github/ulisesbocchio/react-redux-boilerout/issues

[issues-image]: https://img.shields.io/github/issues/ulisesbocchio/react-redux-boilerout.svg
[issues-url]: https://github.com/ulisesbocchio/react-redux-boilerout/issues
[pr-image]: https://img.shields.io/github/issues-pr/ulisesbocchio/react-redux-boilerout.svg
[pr-url]: https://github.com/ulisesbocchio/react-redux-boilerout/pulls
[license-image]: http://img.shields.io/:license-mit-blue.svg
[license-url]: http://badges.mit-license.org
[badges-image]: http://img.shields.io/:badges-10/10-ff6799.svg
[badges-url]: https://github.com/ulisesbocchio/react-redux-boilerout
[gitter-image]: https://img.shields.io/gitter/room/ulisesbocchio/react-redux-boilerout.svg
[gitter-url]: https://gitter.im/ulisesbocchio/react-redux-boilerout?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[npm-image]: https://img.shields.io/npm/v/redux.svg
[downloads-week-svg]: https://img.shields.io/npm/dw/redux.svg
[downloads-month-svg]: https://img.shields.io/npm/dm/redux.svg
[downloads-year-svg]: https://img.shields.io/npm/dy/redux.svg
[downloads-total-svg]: https://img.shields.io/npm/dt/redux.svg
[cdnjs-svg]: https://img.shields.io/cdnjs/v/redux.svg
