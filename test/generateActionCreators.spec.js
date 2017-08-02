import { generateActionCreators } from '../src'

describe('Generate Action Creator Tests', () => {
  describe('compose', () => {

    it('checks actual actions are created', () => {
      const actionCreators = generateActionCreators('update', 'remove', 'SOME_ACTION');
      expect(actionCreators).toHaveProperty('update');
      expect(actionCreators).toHaveProperty('remove');
      expect(actionCreators).toHaveProperty('someAction');
    });

    it('checks regular action creator function is there and returns', () => {
      const actionCreators = generateActionCreators('update');
      expect(actionCreators).toHaveProperty('update');
      expect(actionCreators.update('arg0')).toMatchObject({
        type: 'update',
        payload: ['arg0'],
        variants: ['update', 'onUpdate']
      })
    });

    it('checks UPPER_CASED action creator function is there and returns', () => {
      const actionCreators = generateActionCreators('UPDATE_SOMETHING');
      expect(actionCreators).toHaveProperty('updateSomething');
      expect(actionCreators.updateSomething({some: 'value'}, [1, 2, 3])).toMatchObject({
        type: 'UPDATE_SOMETHING',
        payload: [{some: 'value'}, [1, 2, 3]],
        variants: ['updateSomething', 'onUpdateSomething']
      })
    });
  })
});
