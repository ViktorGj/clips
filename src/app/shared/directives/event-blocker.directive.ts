import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]'
})
export class EventBlockerDirective {
// blocks event default behavior (opening asset in new tab after drop)

  @HostListener('drop', [ '$event' ])
  @HostListener('dragover', [ '$event' ])
  public handleEvent(event: Event) {
    event.preventDefault();
  }

}
