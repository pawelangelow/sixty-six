import { validateClosing } from '../mode';

describe('validateClosing()', () => {
  it('should throw when stock is depleted', () => {
    const setup = () => {
      validateClosing([]);
    };

    expect(setup).toThrowError('Cheating! You cant close the game now!');
  });

  it('should return undefined when deck stock is not depleted', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = validateClosing([1, 2, 3, 4, 5] as any);

    expect(result).toEqual(undefined);
  });
});
