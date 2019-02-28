import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User as FirebaseUser } from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './models/user';
import { SessionStore } from './session.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private sessionStore: SessionStore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.afAuth.authState
      .pipe(
        map((firebaseUser: FirebaseUser) => {
          if (firebaseUser) {
            const user: User = {
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              userId: firebaseUser.uid
            };

            return user;
          } else {
            return null;
          }
        })
      )
      .subscribe((data: User) => {
        this.sessionStore.login(data);
      });
  }

  async signIn(email, password) {
    this.sessionStore.setLoading(true);
    let response;

    try {
      response = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
    } catch (error) {
      this.sessionStore.setError(error);
    }

    this.sessionStore.setLoading(false);
    return response;
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }
}
