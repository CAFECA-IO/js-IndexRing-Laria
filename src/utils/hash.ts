/* eslint @typescript-eslint/no-unused-vars: "off" */
/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
const keccak = require('@cafeca/keccak');

function hashMerkle(leftString: string, rightString: string) {
  let fullString = '';
  fullString = fullString.concat(leftString, rightString);
  const Hash = new keccak('keccak256').update(fullString, 'utf8').digest('hex');
  return Hash;
}

function rlpConverter(value: string): string {
  // map rlpCode;
  return '0x80';
}

function h2d(hex: string): number {
  let result = BigInt('0x' + hex).toString(10);
  result = result.slice(0, 14);
  return Number(result);
}

export {hashMerkle, rlpConverter, h2d};
