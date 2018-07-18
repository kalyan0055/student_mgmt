import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DatatablesPipe implements PipeTransform {
  keys = [];
  transform(array: any[], query: string): any {
    if (query === '') {
      return array;
    }

    if (array != null && array.length > 0) {
      const ans = [];
      if (this.keys.length === 0) {
        this.keys = Object.keys(array[0]);
      }
      for (const i of array) {
        for (const k of this.keys) {
          if (i[k] != null && i[k] !== undefined) {
            if (typeof i[k] !== 'number' && typeof i[k] !== 'object') {
              // console.log(i[k] ,' pipe test',typeof i[k]);
              if (
                i[k].toLowerCase().match('^.*' + query.toLowerCase() + '.*$')
              ) {
                ans.push(i);
                break;
              }
            } else {
              const p = i[k].toString();
              let prev = '';
              for (let j = 0; j < p.length; j++) {
                prev = prev + p[j];
                if (prev === query) {
                  ans.push(i);
                  break;
                }
              }
            }
          }
        }
      }
      return ans;
    } else {
      return [];
    }
  }
}

// transform(value: any, args?: any): any {
//     return null;
//   }

// mine old

// keys = [];
//   transform(array: any[], query: string): any {
//     if (query == '') {
//       return array
//     }

//     if (array != null && array.length > 0) {
//       let ans = [];

//       if (this.keys.length == 0) {
//         this.keys = Object.keys(array[0]);
//       }

//       for (let i of array) {
//         for (let k of this.keys) {
//           // console.log(i,'ival test');

//           if (i[k] != null && i[k] != undefined) {
//             if (i[k].toLowerCase().match('^.*' + query + '.*$')) {
//               ans.push(i);
//               break;
//             }
//             else if (i[k].toUpperCase().match('^.*' + query + '.*$')) {
//               ans.push(i);
//               break;
//             }
//           }
//         }
//       }
//       return ans;
//     }

//   }
