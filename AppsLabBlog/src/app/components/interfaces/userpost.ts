import { Timestamp } from '@angular/fire/firestore';

export interface UserPost {
  id?: string;
  name: string;
  content: string;
  img?: string;
  postedBy: string;
  authorId: string;  // ADD THIS - Firebase Auth UID of the author
  tags?: string[];
  createdAt: Date | any;
  comments?: any[];
  upvotes?: number;
  downvotes?: number;
  hidden?: boolean;  // For admin to hide posts
}

export interface Comment {
  id?: string;
  content: string;
  author: string;
  createdAt: Date | Timestamp;
}
