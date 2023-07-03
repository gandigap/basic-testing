import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const linkedList = generateLinkedList([{ field: '1' }]);

    expect(linkedList).toStrictEqual({
      next: {
        next: null,
        value: null,
      },
      value: {
        field: '1',
      },
    });
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const linkedListNode = generateLinkedList([{ field: '2' }]);

    expect(linkedListNode).toMatchSnapshot();
  });
});
