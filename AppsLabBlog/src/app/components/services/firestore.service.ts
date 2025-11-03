import { Injectable } from '@angular/core';
import { Firestore, collectionData, doc, docData,  updateDoc, query, orderBy, where, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserPost } from '../interfaces/userpost';
import { User } from 'firebase/auth';
import { DocumentReference } from 'firebase/firestore';
import { CollectionReference, DocumentData, collection, addDoc } from 'firebase/firestore';


interface Comment {
  text: string;
  user: string;
  timestamp: Date;
}

interface ChatMessage {
  text: string;
  sender: string;
  timestamp: Date;
}


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  // --- User Posts ---

  getUserPosts(): Observable<UserPost[]> {
    const userPostsRef = collection(this.firestore, 'userPosts');
    return collectionData(userPostsRef, { idField: 'id' }) as Observable<UserPost[]>;
  }

  async updatePostField(postId: string, field: string, value: any): Promise<void> {
    const postDocRef = doc(this.firestore, `userPosts/${postId}`);
    await updateDoc(postDocRef, { [field]: value });
  }

  async addCommentToPost(postId: string, comment: Comment): Promise<void> {
    const postDocRef = doc(this.firestore, `userPosts/${postId}`);

    
  }



  // --- Chat Messages ---

  addChatMessage(message: ChatMessage): Promise<DocumentReference<ChatMessage>> {
    const chatMessagesRef = collection(
  this.firestore,
  'messages'
) as CollectionReference<ChatMessage>;
    return addDoc(chatMessagesRef, message);
  }

  getChatMessages(): Observable<ChatMessage[]> {
    const chatMessagesRef = collection(this.firestore, 'chatMessages');
    const q = query(chatMessagesRef, orderBy('timestamp', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<ChatMessage[]>;
  }

  getUserData(id: string): Observable<User | undefined> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('id', '==', id), limit(1));
    return collectionData(q).pipe(
      map(users => users.length > 0 ? users[0] as User : undefined)
    );
  }
  
  async addUserPost(post: UserPost): Promise<DocumentReference<DocumentData>> {
  const userPostsRef = collection(this.firestore, 'userPosts');
  return await addDoc(userPostsRef, post);
}



 
}

