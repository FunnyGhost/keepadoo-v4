import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User as FirebaseUser } from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './models/user';
import { SessionQuery } from './session.query';
import { SessionStore } from './session.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private sessionStore: SessionStore,
    private query: SessionQuery,
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
        if (data) {
          this.sessionStore.login(data);
          const redirectUrl = this.query.redirectUrl();
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.sessionStore.logout();
        }
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
      this.sessionStore.setError(error.message);
    }

    this.sessionStore.setLoading(false);
    return response;
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }
}
