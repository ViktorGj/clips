import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { combineLatest, forkJoin, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from '../../services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from '../../services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: [ './upload.component.scss' ]
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  nextStep = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being uploaded.';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.min(3)
    ],
    nonNullable: true
  });

  uploadForm = new FormGroup({
    title: this.title
  });

  constructor(private storage: AngularFireStorage,
              private auth: AngularFireAuth,
              private clipsService: ClipService,
              private router: Router,
              public ffmpegService: FfmpegService) {
    auth.user.subscribe(user => this.user = user);
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    // cancel upload if user is navigated off the upload page
    this.task?.cancel()
  }

  // store file locally before uploading to firebase storage
  async storeFile(event: Event) {
    if (this.ffmpegService.isRunning) {
      return
    }

    this.isDragover = false;

    // include upload with drag event and with button upload event
    this.file = (event as DragEvent).dataTransfer ?
      (event as DragEvent).dataTransfer?.files.item(0) ?? null :
      (event.target as HTMLInputElement).files?.item(0) ?? null;

    // restricting file upload to mp4 format
    if (!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);

    this.selectedScreenshot = this.screenshots[ 0 ];

    // set title initially replacing the format string at the end
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );
    this.nextStep = true;
  }

  async uploadFile() {
    // disabling the form during upload
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded.';
    this.inSubmission = true;
    this.showPercentage = true;

    // creating unique name for file name (fire storage doesnt prevent duplicate file names)
    const clipFileName = uuid();
    const clipPath = `clips/${ clipFileName }.mp4`;

    // create path and blob from image screenshot
    const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenshot);
    const screenshotPath = `screenshots/${ clipFileName }.png`;

    // uploading file to storage
    this.task = this.storage.upload(clipPath, this.file);
    // reference to the uploaded file needed for storing the url to the database
    const clipRef = this.storage.ref(clipPath);

    // upload screenshot
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);
    const screenshotRef = this.storage.ref(screenshotPath);

    // combine observables of both tasks to calculate the upload percentage
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
      const [ clipProgress, screenshotProgress ] = progress;

      if (!clipProgress || !screenshotProgress) {
        return
      }

      const total = clipProgress + screenshotProgress;

      this.percentage = total as number / 200;
    });

    // storing clip object in database after getting the url both for clip and screenshot from the storage
    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
      switchMap(() => forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    ).subscribe({
      next: async (urls) => {
        const[clipURL, screenshotURL] = urls;

        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${ clipFileName }.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        // adding clip data to the database
        const clipDocRef = await this.clipsService.createClip(clip);

        console.log(clip)

        this.alertColor = 'green';
        this.alertMsg = 'Success! Your clips is now ready to share with the world.';
        this.showPercentage = false;

        // redirect user to the clip after upload
        setTimeout(() => {
          this.router.navigate([ 'clip', clipDocRef.id ])
        }, 1000)

      },
      error: (error) => {
        // enable form after error
        this.uploadForm.enable();

        this.alertColor = 'red';
        this.alertMsg = 'Upload failed! Please try again later.';
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(error);
      }
    });
  }

}
