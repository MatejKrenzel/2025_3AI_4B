// admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: any;
  upvotes: number;
  downvotes: number;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  posts: Post[] = [];
  loading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = await this.authService.isAdmin(user.uid);
    
    if (!this.isAdmin) {
      this.router.navigate(['/']);
      return;
    }

    await this.loadPosts();
  }

  async loadPosts() {
    this.loading = true;
    try {
      const postsRef = collection(this.firestore, 'userPosts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      this.posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    this.loading = false;
  }

  async deletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deleteDoc(doc(this.firestore, 'posts', postId));
      this.posts = this.posts.filter(p => p.id !== postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  }

  async togglePostVisibility(post: Post) {
    try {
      const postRef = doc(this.firestore, 'posts', post.id);
      await updateDoc(postRef, {
        hidden: !(post as any).hidden
      });
      await this.loadPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}




