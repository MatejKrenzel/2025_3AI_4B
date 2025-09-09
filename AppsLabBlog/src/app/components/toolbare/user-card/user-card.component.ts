import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service'; // Ensure path is correct
import { UserPost } from '../../interfaces/userpost';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [MatCardModule, NgIf, MatButtonModule, MatIconModule, FormsModule, NgFor, DatePipe],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() userPost!: UserPost;
  showCommentInput = false;
  newCommentText = '';

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.userPost.upvotes = this.userPost.upvotes || 0;
    this.userPost.downvotes = this.userPost.downvotes || 0;
    this.userPost.comments = this.userPost.comments || [];
  }

  upvote() {
    if (this.userPost.id) {
      this.userPost.upvotes++;
      this.firestoreService.updatePostField(this.userPost.id, 'upvotes', this.userPost.upvotes)
        .catch((error: any) => console.error("Error upvoting post:", error)); // FIX: Explicitly type error
    }
  }

  downvote() {
    if (this.userPost.id) {
      this.userPost.downvotes++;
      this.firestoreService.updatePostField(this.userPost.id, 'downvotes', this.userPost.downvotes)
        .catch((error: any) => console.error("Error downvoting post:", error)); // FIX: Explicitly type error
    }
  }

  toggleCommentInputArea() {
    this.showCommentInput = !this.showCommentInput;
  }

  toggleComment() {
    this.showCommentInput = !this.showCommentInput;
  }

  addComment() {
    if (this.newCommentText.trim() && this.userPost.id) {
      const newComment = {
        text: this.newCommentText.trim(),
        user: 'CurrentLoggedInUser',
        timestamp: new Date()
      };

      /**this.firestoreService.addCommentToPost(this.userPost.id, newComment)
        .then(() => {
          this.userPost.comments = [...(this.userPost.comments || []), newComment];
          this.newCommentText = '';
          this.showCommentInput = false;
        })
        .catch((error: any) => { // FIX: Explicitly type error
          console.error("Error adding comment:", error);
        });*/
    }
  }
}