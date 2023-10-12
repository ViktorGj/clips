import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import Clip from '../../models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: [ './edit.component.scss' ]
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip: Clip | null = null;
  @Output() update = new EventEmitter();

  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Updating clip.';

  clipID = new FormControl('', {
    nonNullable: true
  });

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.min(3)
    ],
    nonNullable: true
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  });

  constructor(private modal: ModalService,
              private clipService: ClipService) {
  }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnChanges(): void {
    if (!this.activeClip) {
      return;
    }
    if (!this.activeClip.docID) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title)
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }


  async submit() {
    if(!this.activeClip) {
      return
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating clip.';

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value)
    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wront. Try again later';
      return
    }

    // update the title before sending the event to parent list
    if (this.activeClip?.title) {
      this.activeClip.title = this.title.value;
    }
    // send event to parent component to update the clips list
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }

}
