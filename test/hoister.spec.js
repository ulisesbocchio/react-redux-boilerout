import { hoistComponentBehavior } from '../src/hoister';

describe('hoister Tests', () => {
    it('check display name from displayName prop', () => {
        const comp = () => {};
        comp.displayName = 'TestComponent';
        const HositedClass = hoistComponentBehavior(comp, {});

        expect(HositedClass.displayName).toBe('HoistedComponent(TestComponent)');
    });

    it('check display name from name prop', () => {
        const TestComponent = () => {};
        const HositedClass = hoistComponentBehavior(TestComponent, {});

        expect(HositedClass.displayName).toBe('HoistedComponent(TestComponent)');
    });

    it('check display name from default name', () => {
        const HositedClass = hoistComponentBehavior(() => {}, {});

        expect(HositedClass.displayName).toBe('HoistedComponent(Component)');
    });
});
