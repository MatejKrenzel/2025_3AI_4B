import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, query, getDocs, where } from '@angular/fire/firestore';
import { AuthService, UserProfile } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface UserStats {
  totalPosts: number;
  totalComments: number;
  totalUpvotes: number;
  totalDownvotes: number;
  memberSince: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule,ReactiveFormsModule]
})
export class DashboardComponent implements OnInit {
  currentUser: UserProfile | null = null;
  userStats: UserStats | null = null;
  loading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/register']);
      return;
    }

    await this.loadUserData(user.uid);
  }
     navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  async loadUserData(uid: string) {
    this.loading = true;
    
    try {
      // Get user profile
      this.currentUser = await this.authService.getUserProfile(uid);
      this.isAdmin = this.currentUser?.isAdmin || false;

      // Get user statistics
      const stats: UserStats = {
        totalPosts: 0,
        totalComments: 0,
        totalUpvotes: 0,
        totalDownvotes: 0,
        memberSince: this.currentUser?.createdAt || new Date()
      };

      // Count user's posts
      const postsRef = collection(this.firestore, 'userPosts');
      const postsQuery = query(postsRef, where('authorId', '==', uid));
      const postsSnapshot = await getDocs(postsQuery);
      stats.totalPosts = postsSnapshot.size;

      // Calculate total upvotes and downvotes from posts
      postsSnapshot.forEach(doc => {
        const data = doc.data();
        stats.totalUpvotes += data['upvotes'] || 0;
        stats.totalDownvotes += data['downvotes'] || 0;
      });

      // Count user's comments
      const commentsRef = collection(this.firestore, 'Comments');
      const commentsQuery = query(commentsRef, where('authorId', '==', uid));
      const commentsSnapshot = await getDocs(commentsQuery);
      stats.totalComments = commentsSnapshot.size;

      this.userStats = stats;
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    
    this.loading = false;
  }

  async logout() {
    const result = await this.authService.logout();
    if (result.success) {
      this.router.navigate(['/login']);
    }
  }

  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }

  getDaysSinceMember(): number {
    if (!this.userStats) return 0;
    const now = new Date();
    const memberDate = this.userStats.memberSince instanceof Date 
      ? this.userStats.memberSince 
      : new Date();
    const diff = now.getTime() - memberDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
  getAverageUpvotes(): string {
    if (!this.userStats || !this.userStats.totalPosts || this.userStats.totalPosts === 0) {
      return '0';
    }
    return ((this.userStats.totalUpvotes || 0) / this.userStats.totalPosts).toFixed(1);
  }

  getNetKarma(): number {
    if (!this.userStats) return 0;
    return (this.userStats.totalUpvotes || 0) - (this.userStats.totalDownvotes || 0);
  }

  getTotalContributions(): number {
    if (!this.userStats) return 0;
    return (this.userStats.totalPosts || 0) + (this.userStats.totalComments || 0);
  }
}
