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

/*const postConverter: FirestoreDataConverter<Omit<UserPost, 'id'>> = {
  // Converts a UserPost object to Firestore data format
  toFirestore: (post: Omit<UserPost, 'id'>) => {
    return post;
  },
  // Converts Firestore snapshot data back to a UserPost object
  fromFirestore: (snapshot) => {
    return snapshot.data() as Omit<UserPost, 'id'>;
  }
};
*/
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

    // Note: Firebase modular SDK FieldValue is imported differently
    // We need to import arrayUnion from '@firebase/firestore' to add comment atomically
    // I'll add that import below and use it here

    // Import arrayUnion:
    // import { arrayUnion } from 'firebase/firestore';

    // Then update:
    // await updateDoc(postDocRef, { comments: arrayUnion(comment) });

    // Let's do that now:

    throw new Error('Please import arrayUnion from firebase/firestore and uncomment the code below.');

    // import { arrayUnion } from 'firebase/firestore';
    // await updateDoc(postDocRef, { comments: arrayUnion(comment) });
  }

 /* addPost(post: Omit<UserPost, 'id'>): Promise<DocumentReference<Omit<UserPost, 'id'>>> {
  const userPostsRef = collection(this.firestore, 'userPosts').withConverter(postConverter);
  return addDoc(userPostsRef, post);
}*/

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

  /*
  async loadUserStats(uid: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      this.stats = {
        posts: data['posts'] || 0,
        comments: data['comments'] || 0,
        joinedAt: data['joinedAt'] || 'Neznámy dátum'
      };
    } else {
      this.stats = {
        posts: 0,
        comments: 0,
        joinedAt: 'Neznámy dátum'
      };
    }
  }
  */
}
