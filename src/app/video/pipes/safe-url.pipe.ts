import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeURL'
})
export class SafeURLPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
