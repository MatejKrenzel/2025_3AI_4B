import { Timestamp } from '@angular/fire/firestore';

export interface UserPost {
  id?: string;
  name: string;
  content: string;
  img?: string;
  postedBy: string;
  authorId: string;  
  tags?: string[];
  createdAt: Date | any;
  comments?: any[];
  upvotes?: number;
  downvotes?: number;
  hidden?: boolean; 
}

export interface Comment {
  id?: string;
  content: string;
  author: string;
  createdAt: Date | Timestamp;
}
