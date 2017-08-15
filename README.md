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
import { store } from './redux'; //export your store!

export default generateActionDispatchers(store.dispatch,
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

Redux's `dispatch` function is bound to the resulting dispatchers.

### Forget about reducer functions with nasty `switch` statements

Simply create reducer classes with action listeners

`TodosReducer.js`
```js
import { sliceReducer } from 'react-redux-boilerout';

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

export default sliceReducer('todos')(TodosReducer);

```
And don't forget to export your class using the `sliceReducer` decorator for which you need specify the store **slice** name that
it will listen to, like you would with `combineReducers`.

The initial state of the **slice** is defined with the special **static** function `initialState`.

Each method of the class receives the arguments passed to the action dispatcher when it was called, and the last argument
is the current `state`. The method must then return the new state of the **slice**, just like you would with a regular reducer,
without mutating the current state of course, instead you need to make sure it's a new instance with the appropriate changes.

For the above example with an empty preloadedState passed to redux, the store would be initialized with:

```js
{
    todos: {
        items: [],
        filter: 'SHOW_ALL'
    }
}
```
And after calling `TodosActions.setVisibilityFilter('ACTIVE')`, `TodosActions.addTodo('Buy Beer')` and `TodosActions.toggleTodo(1)`
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

Using a similar approach to `react-redux`'s `connect` HOC, `react-redux-boilerout` provides `connectSlice` to connect
your component to a specific **slice** of the state directly, without having to write the selection boilerplate.

`TodoListContainer.js`
```js
import { connectSlice } from 'react-redux-boilerout';
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

const mapSliceStateToProps = (slice) => ({
    todos: getVisibleTodos(slice.items, slice.filter)
});

const VisibleTodoList = connectSlice({
        slice: 'todos',
        actions: TodosActions
    },
    mapSliceStateToProps
)(TodoList);

export default VisibleTodoList
```
Here, on the `connectSlice` call we listen to the `todos` **slice** of the store by specifying:
```js
slice: 'todos'
```
And we are mapping the `TodosActions` action dispatchers to props in the target component with:
```js
actions: TodosActions
```
We also pass a `mapSliceStateToProps` function that we use to narrow down the store slice to the props the specific
component needs in the same fashion of `redux`'s `mapStateToProps` but with the difference that this function will receive
the **slice** mapped by `TodosReducer` only. ***`mapSliceStateToProps` is an optional argument***, that if not passed
the target component will get the entire store **slice** as props.

Another optional argument that you can pass after `mapSliceStateToProps` is `mapDispatchToProps` shown in the next example:

`FilterLinkContainer.js`
```js
import { connectSlice } from 'react-redux-boilerout';
import TodosActions from './TodosActions';
import TodosReducer from './TodosReducer';
import FilterLink from './FilterLink';

const mapSliceStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.filter
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
      TodosActions.setVisibilityFilter(ownProps.filter);
  }
});

const FilterLinkContainer = connectSlice({
    slice: 'todos'
  },
    mapSliceStateToProps,
    mapDispatchToProps
)(FilterLink);

export default FilterLinkContainer
```
Here, we basically bind a prop `onClick` to the target component that will dispatch an action, just like you would
with vanilla `react-redux`, except that we don't have to wrap the call with dispatch. The `dispatch` argument is there
just in case you need it. 

### Wait a second, won't `onClick` create a new function every time and trigger al re-render?
 Fortunately no, `mapSliceStateToProps` and `mapDispatchToProps` are wrapped with `reselect` and provided to `redux`
 as functions so each component instance will memoize the props properly.

### Finally, initialize `redux` with a special reducer that combines all your slice reducers

You need to provide `combineSliceReducers` any amount of `sliceReducer` functions and export the store if you're calling
`generateActionDispatchers` from a different file.

`redux.js`
```js
import TodosReducer from './TodosReducer';
import { createStore } from 'redux';
import { combineSliceReducers } from 'react-redux-boilerout';

const reducer = combineSliceReducers(TodosReducer);

export const store = createStore(reducer);
```

Last step is to inject the store into your `Provider`

`AppProvider.js`
```js
import React from 'react'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './redux'

const AppProvider = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default AppProvider;
```
## Example

Head on to [redux-todos](https://github.com/ulisesbocchio/redux-todos) for a working version of `redux`'s [todos](https://github.com/reactjs/redux/tree/master/examples/todos) example implemented
using `react-redux-boilerout`.

## API Docs

### `function generateActionDispatchers(dispatch, ...actions): <object>`
Generates an object that maps the action names to function properties that are action dispatchers.
If the actions are in the form of `ACTION_NAME` the dispatcher functions are normalized to the `actionName` form (camelCase).
For each action, let's say 'sayHello' the resulting function property will also have a `defer` version that will dispatch
the action asynchronously.
 
##### Arguments:
* dispatch: redux store dispatch function to bind the action creators with.
* actions: an arbitrary list of strings to generate the action dispatchers.

**Returns** an object with the dispatcher function attributes

##### Example:
```js
const Actions = generateActionDispatchers(dispatch, 'SAY_HELLO');
Actions.sayHello('Hi There!'); //dispatch action synchronously
Actions.sayHello.defer('Hi There!'); //dispatch action asynchronously
```
### `function sliceReducer(slice): <function (ActionReducerClass): <reducer>>`
Generates a reducer function for the `slice` portion of the store that will use `class instance` of the provided class
that upon execution on action dispatch it will select the appropriate method based on the action's `type`
when dispatching actions.
##### Arguments:
* slice: the slice the reducer will map, as a string.
* ActionReducerClass: the actual class that will be doing the reducing.

**Returns** a slice reducer wrapping an instance of `ActionReducerClass`

##### Example:
Given the followin action:
```js
Actions.sayHello('E.T.', 'call', 'home');
```
the following `action reducer` will transform the state for the slice `earth` when `sayHello` is dispatched:
```js
class EarthReducer {
    sayHello(who, did, what, state) {
        return {...state, messages: [state.messages, `${who} ${did} ${what}`]};
    }
}

const earthReducer = sliceReducer('earth')(EarthReducer);
```
For actions declared with `UPPER_CASE` style, action reducer methods map to their `camelCase` counterpart. Also action reducers methods can be named
starting with `on + ActionName`.
For instance, methods named `onSayHello` and `sayHello` will listen to action `SAY_HELLO` or `sayHello`.

### `function connectSlice({slice, actions, inject}, mapSliceStateToProps, mapDispatchToProps): <function (TargetComponent): <hoc>>`
Higher Order Component that will decorate `TargetComponent` to listen for store changes on the **slice** of the store
mapped by `slice`. Arguments `actions`, `inject`, `mapSliceStateToProps` and `mapStoreDispatchToProps` are optional.

##### Arguments:
* slice: **slice name** the target component will map props from.
* actions: an object generated with `generateActionDispatchers` of which its actions will be injected as props
* inject: any arbitrary object of which its attributes will be injected as props
* mapSliceStateToProps: function(slice, props): analog to `redux`'s `mapStateToProps` but that will receive only the slice
 mapped by the provided `sliceReducer`. If this function is not provided, the entire slice is mapped to props.
 This function is memoize'd
* mapDispatchToProps: function(dispatch, props): Same as `redux`'s `mapDispatchToProps`. This function is memoize'd
* TargetComponent: the actual react component that will be connected to the store

**Returns** a HOC that connects the target component to the store.

##### Example:
```js
const VisibleTodoList = connectSlice({
        slice: 'todos',
        actions: TodosActions
    },
    mapSliceStateToProps,
    mapDispatchToProps
)(TodoList);
```

### `function combineSliceReducers(...sliceReducers): <reducer>`
Analog to `redux`'s `combineReducers` but for reducers generated with the `sliceReducer` decorator.

##### Arguments:
* sliceReducers: the slice reducers to combine into one reducer.

**Returns** a `redux` reducer.

##### Exampple:
```js
import { combineSliceReducers } from 'react-redux-boilerout';

const reducer = combineSliceReducers(TodosReducer, SomeOtherSliceReducer);

export const store = createStore(reducer);
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
[npm-image]: https://img.shields.io/npm/v/react-redux-boilerout.svg
[downloads-week-svg]: https://img.shields.io/npm/dw/react-redux-boilerout.svg
[downloads-month-svg]: https://img.shields.io/npm/dm/react-redux-boilerout.svg
[downloads-year-svg]: https://img.shields.io/npm/dy/react-redux-boilerout.svg
[downloads-total-svg]: https://img.shields.io/npm/dt/react-redux-boilerout.svg
[cdnjs-svg]: https://img.shields.io/cdnjs/v/react-redux-boilerout.svg
