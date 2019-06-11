import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { isNullOrUndefined, isUndefined } from 'util';

export class UniqueValidators {
  /**
   * FormArray validation. Checks the values in the given path.
   * @param {string | Array<string | number>} path
   * @returns {(arr: FormArray) => any}
   */
  static uniqueInArray(path?: string | Array<string | number>) {
    return (arr: FormArray) => {
      let error = null;
      const matches = arr.controls.reduce((acc, ac: AbstractControl) => {
        const val = path === '' || path === null ? ac.value : ac.get(path).value;
        if (isNullOrUndefined(val) || val.length === 0) {
          return acc;
        }
        if (isUndefined(acc[val])) {
          acc[val] = 1;
        } else {
          error = { unique: val };
        }
        return acc;
      }, {});
      return error;
    };
  }

  /***
   * FormControl validation. Checks its value against the values in the given path of the given array's controls.
   * @param {FormArray} formArray - the array to check
   * @param {string | Array<string | number>} path - the path in each array item to check
   * @returns {(c: FormControl) => null | {unique: any}}
   */
  static uniqueIn(formArray: FormArray, path?: string | Array<string | number>) {

    return (c: FormControl) => {
      const value = c.value;
      const matches = formArray.controls.filter((abstractControl: AbstractControl) => {
        return abstractControl.get(path).value === value;
      });
      return matches.length === 1 ? null : {
        unique: value
      };
    };
  }

}
