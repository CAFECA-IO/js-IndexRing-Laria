import {group} from 'console';
import {h2d} from './utils/hash';

/* eslint @typescript-eslint/no-unused-vars: "off" */
/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
const keccak = require('@cafeca/keccak');

// isSelected is used for checkbox
type groupSizeAndSaltObj = {
  groupSize: number;
  salt: number;
};

class ConsistentHashing {
  // use groupSizeMap to store already calculated group size
  nodeElements: string[];
  groupSize: number;
  groupSizeMap: {[key: string]: number} = {};
  salt: number;

  constructor(elementsList: string[], groupSize: number | null, salt = 0) {
    // set nodeElements
    this.nodeElements = elementsList;

    const resultMap: {[key: string]: string} = {};

    // set GroupSize and salt from training
    let saltAndGroupSize: number[] = [];
    // if no groupsize and salt , we set it for user
    if (groupSize === null) {
      saltAndGroupSize = this.training(this.nodeElements);
      this.salt = saltAndGroupSize[0];
      this.groupSize = saltAndGroupSize[1];
    }

    // if groupSize has value
    if (groupSize !== null) {
      // set value
      this.salt = salt;
      this.groupSize = groupSize;
      // if we have groupsize and salt but collision happens -> return recommendation
      for (let i = 0; i < elementsList.length; i++) {
        // if collision -> return recommendation
        if (resultMap.hasOwnProperty(this.indexOf(this.nodeElements[i]))) {
          saltAndGroupSize = this.training(this.nodeElements);
          this.salt = saltAndGroupSize[0];
          this.groupSize = saltAndGroupSize[1];
          break;
        } else {
          resultMap[this.indexOf(this.nodeElements[i])] = '';
        }
      }
    }
  }

  training(elements: string[]): number[] {
    const len = elements.length;
    const groupSizeMap: {[k: string]: string} = {};
    let result = 0;
    let groupSize = 0;
    let count = 0;

    // set groupSize
    if (this.groupSizeMap.hasOwnProperty(len.toString())) {
      // return mapped groupSize directly
      groupSize = this.groupSizeMap[len.toString()];
    } else {
      // do calculation and return result
      for (let i = 1; i < 21; i++) {
        const slotSize = Math.pow(2, i);

        if (slotSize > len * 4) {
          result = slotSize;
          this.groupSizeMap[len.toString()] = result;
          break;
        }
      }

      groupSize = result;
    }

    // set salt

    for (let i = 0; i < elements.length; i++) {
      const originalHash = new keccak('keccak256').update(elements[i], 'utf8').digest('hex');
      const hash: number = h2d(originalHash);

      if (groupSizeMap.hasOwnProperty((hash % groupSize).toString()) === false) {
        // create element and put it in the groupSizeMap
        if (count === 0) {
          groupSizeMap[(hash % groupSize).toString()] = originalHash;
        } else {
          let saltHash = new keccak('keccak256')
            .update(elements[i] + count.toString())
            .digest('hex');
          saltHash = h2d(saltHash);
          // 換個數字做 hash
          groupSizeMap[(saltHash % groupSize).toString()] = saltHash;
        }
      } else {
        // delete groupSizeMap
        for (const key in groupSizeMap) {
          delete groupSizeMap[key];
        }
        i = 0;
        count = count + 1;
        // need data to try it
        if (count > groupSize) {
          groupSize = groupSize * 2;
          continue;
        }
      }
    }

    return [count, groupSize];
  }

  indexOf(element: string) {
    // do hash and get index
    let originalHash = '';
    if (this.salt == 0) {
      originalHash = new keccak('keccak256').update(element, 'utf8').digest('hex');
    } else {
      originalHash = new keccak('keccak256').update(element + this.salt, 'utf8').digest('hex');
    }

    // return hash
    const hash: number = h2d(originalHash);
    const result = hash % this.groupSize;

    // return group index
    return result;
  }

  toJSON(): groupSizeAndSaltObj {
    // return object's groupSize and salt (JSON format)
    const result = {
      groupSize: this.groupSize,
      salt: this.salt,
    };
    return result;
  }
}

export default ConsistentHashing;
