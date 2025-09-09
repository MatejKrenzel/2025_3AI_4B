import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut, User } from 'firebase/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { CommonModule, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';
import { onAuthStateChanged } from 'firebase/auth';
import { FirestoreService } from '../components/services/firestore.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  user$: Observable<firebase.User | null>;
  defaultAvatar: string = 'https://www.gravatar.com/avatar?d=mp';

  stats: {
    posts: number,
    comments: number,
    joinedAt: string
  } | null = null;

  constructor(
    private router: Router,
    private firestore: FirestoreService,
    public auth: AuthService
  ) {
    this.user$ = this.auth.user$;
  }
    
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }


ngOnInit(): void {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      this.user = user;
      this.firestore.getUserData(user.uid).subscribe(user => {
        if (user != undefined) {
          this.user = user
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  });
}





  logout(): void {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Chyba pri odhlasovaní:', error);
    });
  }
}
