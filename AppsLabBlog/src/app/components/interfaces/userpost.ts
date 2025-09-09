export interface UserPost {
  id?: string;
  imageUrl: string;
  description: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  timestamp: Date;
  // dokodit interface comment podla toho, ako si to date na firebase
  comments: Comment[];
}

export interface Comment {
  id?: string;
  userId: string;
  text: string;
  timestamp: Date;
}