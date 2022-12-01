import ConsistentHashing from '../consistnt_hashing';

// check hashCalculator output
describe('Check hashCalculator output', () => {
  // test hash function
  test('test hash(two hash) to hex string', () => {
    const consistentHashing = new ConsistentHashing(
      [
        '1wjkop;,',
        '2sj',
        '33jio',
        '4qoj',
        '5wjko',
        '63790',
        '73jho',
        '800000',
        '212',
        '23707',
        'asd',
      ],
      null
    );
    const result = consistentHashing.toJSON();
    // check collision groupSize and salt
    expect(result['groupSize']).toStrictEqual(64);
    expect(result['salt']).toStrictEqual(3);
  });
});

// check the consistenthash function
describe('text indexOf function', () => {
  test('test indexOf', () => {
    const consistentHashing = new ConsistentHashing(['1', '2', '3'], null);
    const index = consistentHashing.indexOf('1');
    // // return index
    expect(index).toStrictEqual(14);
  });
});

// check the consistenthash function
describe('text consistentHashing with value', () => {
  test('test indexOf', () => {
    const consistentHashing = new ConsistentHashing(['1', '2', '3'], 1, 2);
    const index1 = consistentHashing.indexOf('1');
    const index2 = consistentHashing.indexOf('2');
    const index3 = consistentHashing.indexOf('3');
    // return index
    expect(index1).toStrictEqual(14);
    expect(index2).toStrictEqual(6);
    expect(index3).toStrictEqual(7);
  });
});

// test consistentHashing without elements
describe('text consistentHashing with value', () => {
  test('test indexOf', () => {
    const consistentHashing = new ConsistentHashing(['1', '2', '3'], null, 2);
    const index1 = consistentHashing.indexOf('1');
    const index2 = consistentHashing.indexOf('2');
    const index3 = consistentHashing.indexOf('3');
    // return index
    expect(index1).toStrictEqual(14);
    expect(index2).toStrictEqual(6);
    expect(index3).toStrictEqual(7);
  });
});

// test consistentHashing without elements
describe('text groupSizeMap with value', () => {
  test('test groupSizeMap', () => {
    const consistentHashing = new ConsistentHashing(['1', '2', '3'], null, 2);
    const groupSizeAndSalt = consistentHashing.training(['2', '7', '6']);
    // return index
    expect(groupSizeAndSalt[1]).toStrictEqual(16);
  });
});

// test consistentHashing without elements
describe('text training collision handling  with big size with value', () => {
  test('test groupSizeMap', () => {
    const testList: string[] = [];

    for (let i = 0; i < 300; i++) {
      const testValue = Math.random() * 1000;
      testList.push(testValue.toString());
    }

    const consistentHashing = new ConsistentHashing(testList, null, 2);
    expect(consistentHashing.toJSON()['groupSize']).toStrictEqual(8192);
  });
});
