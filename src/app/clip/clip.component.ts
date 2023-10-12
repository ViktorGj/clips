import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';
import Clip from '../models/clip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: [ './clip.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ClipComponent implements OnInit {
  // static: true - to update viewChild before OnInit cycle (used for static element in the template)
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: videojs.Player;
  clip?: Clip;

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);

    // get clip data from resolver
    this.route.data.subscribe(data => {
      this.clip = data['clip'] as Clip;

      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4'
      })
    })
  }

}
