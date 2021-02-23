import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
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
    this.sessionStore.setLoading(true);
    this.afAuth.authState
      .pipe(
        map((firebaseUser) => {
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
        this.sessionStore.setLoading(false);
      });
  }

  async signIn(email, password) {
    this.sessionStore.setLoading(true);
    let response;

    try {
      response = await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      this.sessionStore.setError(error.message);
    }

    this.sessionStore.setLoading(false);
    return response;
  }

  async signUp(email, password) {
    this.sessionStore.setLoading(true);
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      this.sessionStore.setError(error.message);
    }

    this.sessionStore.setLoading(false);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/login']);
  }
}
