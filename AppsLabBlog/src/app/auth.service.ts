import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);

  /** Aktuálny prihlásený používateľ ako RxJS stream */
  user$: Observable<User | null>;

  constructor() {
    this.user$ = new Observable<User | null>((subscriber) => {
      return onAuthStateChanged(this.auth, (user) => {
        subscriber.next(user);
      });
    });
  }

  /** Prihlásenie */
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /** Odhlásenie */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  /** Registrácia */
  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }
}
