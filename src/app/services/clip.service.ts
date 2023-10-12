import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import Clip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<Clip>;

  constructor(private db: AngularFirestore,
              private auth: AngularFireAuth,
              private storage: AngularFireStorage) {
    // reading / generating collection
    this.clipsCollection = db.collection('clips');
  }

  createClip(data: Clip): Promise<DocumentReference<Clip>> {
    return this.clipsCollection.add(data);
  }

  public getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const [user, sort] = values;

        if (!user) {
          return of([]);
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort === '1' ? 'desc' : 'asc'
        );

        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<Clip>).docs)
    )
  }

  public updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    });
  }

  async deleteClip(clip: Clip) {
    const clipRef = this.storage.ref(`clips/${ clip.fileName }`);

    await clipRef.delete();

    await this.clipsCollection.doc(clip.docID).delete();
  }
}
