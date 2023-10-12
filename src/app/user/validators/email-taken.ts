import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {
  constructor(private auth: AngularFireAuth) {
  }

  validate = (control: AbstractControl): Observable<ValidationErrors | null> => {
    // checking if email exists
    return of(this.auth.fetchSignInMethodsForEmail(control.value).then(
        response => response.length ? { emailTaken: true } : null
      )
    )
  }

}
