import {hashMerkle, rlpConverter} from '../utils/hash';

// check buffer output
describe('Check hashCalculator output', () => {
  // test uint8array to hex string
  test('test hash(two hash) to hex string', () => {
    const hexString = hashMerkle('clemmy', 'liao');
    expect(hexString).toStrictEqual(
      '66bc121771f21aa6099af794e3467eb8b833c1fca434e3936f0553206adc9bbe'
    );
  });
});

// check rlp code output
describe('Chech rlp code output', () => {
  // test uint8array to hex string
  test('test empty rlp code', () => {
    const rlpCode = rlpConverter('');
    expect(rlpCode).toStrictEqual('0x80');
  });
});
