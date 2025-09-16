import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserCardComponent } from '../../components/toolbare/user-card/user-card.component';

import { NgFor } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { FirestoreService } from '../../components/services/firestore.service';
import { UserPost } from '../../components/interfaces/userpost';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserCardComponent, MatToolbarModule, MatButtonModule, MatIconModule, RouterOutlet, NgFor, FooterComponent, DashboardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
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