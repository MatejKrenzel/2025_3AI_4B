import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Comment, UserPost } from '../interfaces/userpost';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [MatCardModule, NgIf, MatButtonModule, MatIconModule, FormsModule, NgFor],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() userPost!: UserPost;
  showCommentInput = false;
  newCommentText = '';
  private localComments: Comment[] = [];

  ngOnInit() {
    // Create a defensive copy of comments to ensure isolation
    this.localComments = [...this.userPost.comments];
  }

  upvote() {
    this.userPost.upvotes++;
  }

  downvote() {
    this.userPost.downvotes++;
  }

  toggleComment() {
    this.showCommentInput = !this.showCommentInput;
  }

  addComment() {
    if (this.newCommentText.trim()) {
      const newComment = { text: this.newCommentText, user: 'You' };
      //this.localComments.push(newComment);
      // Update the userPost comments to reflect the change
      this.userPost.comments = [...this.localComments];
      this.newCommentText = '';
      this.showCommentInput = false;
    }
  }

  getComments() {
    return this.localComments;
  }
}