import { bindAllActionDispatchers, generateActionDispatchers } from '../src'

describe('Bind All Action Dispatcher Tests', () => {
  it('checks all action dispatchers have dispatch', () => {

    const actionDispatchers = [
      generateActionDispatchers('one', 'two'),
      generateActionDispatchers('three', 'four'),
      generateActionDispatchers('five', 'six')
    ];
    const as = [];
    bindAllActionDispatchers(actionDispatchers, a => as.push(a));

    actionDispatchers[0].one(1);
    actionDispatchers[0].two(2);
    actionDispatchers[1].three(3);
    actionDispatchers[1].four(4);
    actionDispatchers[2].five(5);
    actionDispatchers[2].six(6);

    expect(as.length).toEqual(6);
  });
});
