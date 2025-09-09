import { Component, NgModule } from '@angular/core';
import { HomeComponent } from './home/home/home.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, RouterOutlet, RouterModule, MatIcon, MatToolbarRow, RouterLink, RouterModule, MatToolbar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {

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