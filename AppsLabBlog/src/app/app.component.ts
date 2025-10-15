import { Component, NgModule } from '@angular/core';
import { HomeComponent } from './home/home/home.component';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { FirestoreService } from "./components/services/firestore.service";
import { UserPost } from "./components/interfaces/userpost";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, RouterOutlet, RouterModule, MatIcon, MatToolbarRow, RouterLink, RouterModule, MatToolbar,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {
 userPosts!: UserPost[];

  constructor(private router: Router, private firestoreService: FirestoreService) {
    this.firestoreService.getUserPosts().subscribe((data: UserPost[]) => {
      this.userPosts = data;
      console.log(this.userPosts);
    })
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
const myObservable = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);

  // Teardown function (optional)
  return () => {
    console.log('Teardown executed');
  };
});


myObservable.subscribe({
  next: (value) => console.log(value),
  error: (error) => console.error(error),
  complete: () => console.log('Completed'),
});