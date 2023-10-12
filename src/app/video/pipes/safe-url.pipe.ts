import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeURL'
})
export class SafeURLPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: string) {
    // wraps url with safe url object, and unwrap during rendering without auto-sanitizing
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
