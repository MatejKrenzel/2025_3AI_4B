import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { UserPost } from "../../components/interfaces/userpost";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { NgForOf } from '@angular/common';


@Component({
  selector: 'app-new-post',
  imports: [MatToolbar, RouterOutlet, MatLabel, MatFormField, MatInput, FormsModule, MatButton, MatButtonModule, ReactiveFormsModule, MatCard, MatCardContent, NgForOf,MatChipsModule, MatIcon],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {
  userPosts!: UserPost[];
postForm!: FormGroup;
tags:string[] = [];

  constructor(private router: Router, private firestoreService: FirestoreService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.firestoreService.getUserPosts().subscribe((data: UserPost[]) => {
      this.userPosts = data;
      console.log(this.userPosts);
 
    })
    
  }
ngOnInit(){
  this.postForm = this.fb.group({
    name: [null, Validators.required],
    content: [null,[Validators.required, Validators.maxLength(5000)]],
    img: [null,Validators.required],
    postedBy :[null,Validators.required]
  })
}
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  add(event:any){
    const value = (event.value||``).trim();
    if(value){
    this.tags.push(value);}
    event.chipInput!.clear();}
    remove(tag:any){
      const index = this.tags.indexOf(tag);

      if(index>0){
       this.tags.splice(index,1); 
      }

    
  }
submitPost() {
  if (this.postForm.valid) {
    const newPost: UserPost = {
      name: this.postForm.value.name,
      content: this.postForm.value.content,
      img: this.postForm.value.img,
      postedBy: this.postForm.value.postedBy,
      tags: this.tags,
      createdAt: new Date(),
       comments: [],
    };

    this.firestoreService.addUserPost(newPost)
      .then(() => {
        this.snackBar.open('✅ Post added successfully!', 'Close', { duration: 3000 });
        this.postForm.reset();
        this.tags = [];
      })
      .catch((error) => {
        console.error('Error adding post:', error);
        this.snackBar.open('❌ Failed to add post.', 'Close', { duration: 3000 });
      });
  } else {
    this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
  }
}



}


