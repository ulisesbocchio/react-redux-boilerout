import mixin from '../src/mixin';

describe('Class Mixin Tests', () => {
    class A {
        someMethod() {}
        someOtherMethod() {}
    }

    it('checks mixin creation', () => {
        const mixer = mixin(
            {
                addedMethod() {}
            },
            {
                prop: true
            }
        );
        const augmentedClass = mixer(A);
        const instance = new augmentedClass();

        expect(instance).toBeInstanceOf(mixer);
        expect(mixer.prop).toBe(true);
        expect(instance).toBeInstanceOf(A);
    });
});
