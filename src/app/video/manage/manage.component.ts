import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import Clip from '../../models/clip.model';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: Clip[] = [];
  activeClip: Clip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private clipService: ClipService,
              private modal: ModalService) {
    this.sort$ = new BehaviorSubject<string>(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.videoOrder = params.get('sort') ?? '1';
      this.sort$.next(this.videoOrder);
    });

    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = [];

      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        });
      });
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;

    // this.router.navigateByUrl(`/manage?sort=${ value }`);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    });
  }

  openModal(event: Event, clip: Clip) {
    event.preventDefault();

    this.activeClip = clip;

    this.modal.toggleModal('editClip');
  }

  update(event: Clip) {
    this.clips.forEach((element, index) => {
      if (element.docID == event.docID) {
        this.clips[ index ].title = event.title;
      }
    })
  }

  deleteClip(event: Event, clip: Clip) {
    event.preventDefault();

    this.clipService.deleteClip(clip);

    // delete clip locally after deleting from the storage and db
    this.clips.forEach((element, index) => {
      if (element.docID == clip.docID) {
        this.clips.splice(index, 1);
      }
    })
  }

  async copyToClipboard($event: MouseEvent, docID: string | undefined) {
    $event?.preventDefault();

    if(!docID) {
      return
    }

    const url = `${location.origin}/clip/${docID}`;

    await navigator.clipboard.writeText(url);

    alert('Link Copied!');
  }
}
