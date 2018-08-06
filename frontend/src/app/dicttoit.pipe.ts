import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'DicttoitPipe',  pure: false })
export class DicttoitPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value).map(key => key);
  }
}
