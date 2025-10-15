import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { FirestoreService } from '../../components/services/firestore.service';
import { UserPost } from '../../components/interfaces/userpost';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { GraphComponent } from '../../components/chart/chart.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    NgFor,
    NgIf,
    DatePipe,
    FooterComponent,
    DashboardComponent,
    GraphComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userPosts: UserPost[] = [];

  constructor(private router: Router, private firestoreService: FirestoreService) {}

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  ngOnInit(): void {
    this.firestoreService.getUserPosts().subscribe((posts: UserPost[]) => {
      this.userPosts = posts.sort((a, b) => {
        const timeA = this.getTimestamp(a.createdAt);
        const timeB = this.getTimestamp(b.createdAt);
        return timeB - timeA;
      });
    });
  }

  private getTimestamp(date: any): number {
    if (!date) return 0;
    if (date instanceof Date) return date.getTime();
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().getTime();
    }
    return 0;
  }

  // Format date for display
  formatDate(date: any): string {
    if (!date) return 'Just now';
    
    let jsDate: Date;
    
    if (date instanceof Date) {
      jsDate = date;
    } else if (date.toDate && typeof date.toDate === 'function') {
      jsDate = date.toDate();
    } else {
      return 'Just now';
    }

    const now = new Date();
    const diff = now.getTime() - jsDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return jsDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: jsDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  }
}