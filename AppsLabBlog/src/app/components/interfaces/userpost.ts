export interface UserPost {
 id?: string;
  name: string;
  content: string;
  img: string;
  postedBy: string;
  tags?: string[];
  createdAt?: Date;
  comments: Comment[];
}

export interface Comment {
  id?: string;
  userId: string;
  text: string;
  timestamp: Date;
}