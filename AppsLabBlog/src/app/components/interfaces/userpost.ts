import { Timestamp } from '@angular/fire/firestore';

export interface UserPost {
  id?: string;
  name: string;
  content: string;
  img?: string;
  postedBy: string;
  tags?: string[];
  createdAt: Date | Timestamp | any;
  comments?: Comment[];
  upvotes?: number;
  downvotes?: number;
}

export interface Comment {
  id?: string;
  content: string;
  author: string;
  createdAt: Date | Timestamp;
}