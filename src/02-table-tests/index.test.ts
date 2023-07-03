import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 1, action: Action.Add, expected: 2 },
  { a: 1, b: 1, action: Action.Subtract, expected: 0 },
  { a: 1, b: 1, action: Action.Multiply, expected: 1 },
  { a: 1, b: 1, action: Action.Divide, expected: 1 },
  { a: 1, b: 1, action: Action.Exponentiate, expected: 1 },
  { a: 1, b: 2, action: '', expected: null },
  { a: 'qw', b: 'qw', action: Action.Exponentiate, expected: null },
];

describe('simpleCalculator', () => {
  it.each(testCases)(
    'should return equal calculate results like a previous task ',
    ({ a, b, action, expected }) => {
      const extractedUrls = simpleCalculator({ a, b, action });

      expect(extractedUrls).toEqual(expected);
    },
  );
});
