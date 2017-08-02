import { actionReducersEnhancer, actionReducer, generateActionDispatchers, connectActionReducer } from '../src';
import { createStore } from 'redux';
import React from 'react';
import PropTypes from 'prop-types';

const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
);

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
};


const TodoList = ({ todos, toggleTodo }) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => toggleTodo(todo.id)}
      />
    )}
  </ul>
);

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  toggleTodo: PropTypes.func.isRequired
};

describe('Connect Action Reducers Tests', () => {
  class A {
    constructor() {
      this.someField = 0;
    }
    someMethod(){}
    someOtherMethod(){}
  }

  it('checks connectActionReducer creates component', () => {
    const enhancer = actionReducersEnhancer();
    const aReducer = actionReducer('a')(A);
    const actionReducers = [aReducer];
    const theActions = generateActionDispatchers('start', 'stop');
    const actionCreators = [theActions];
    const store = createStore({ actionReducers, actionCreators }, enhancer);

    const container = connectActionReducer({
        actionReducer: aReducer,
        actions: theActions
      },
      (s, p) => p
    )(TodoList);
  });
});

