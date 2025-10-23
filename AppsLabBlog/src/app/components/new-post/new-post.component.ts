import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../../auth.service';
import { UserPost } from "../../components/interfaces/userpost";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormField, MatInput, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    MatToolbar, 
    RouterOutlet, 
    MatLabel, 
    MatFormField, 
    MatInput,
    MatError,
    MatHint,
    MatSuffix,
    FormsModule, 
    MatButton, 
    MatButtonModule, 
    ReactiveFormsModule, 
    MatCard, 
    MatCardContent, 
    NgForOf,
    NgIf,
    MatChipsModule, 
    MatIcon,
    MatProgressBar,
MatProgressSpinner,
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit {
  userPosts!: UserPost[];
  postForm!: FormGroup;
  tags: string[] = [];
  currentUserName: string = '';
  currentUserId: string = '';
  loading: boolean = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  uploadingImage: boolean = false;
  formInitialized: boolean = false; // Add this flag

  constructor(
    private router: Router, 
    private firestoreService: FirestoreService, 
    private authService: AuthService,
    private fb: FormBuilder, 
    private snackBar: MatSnackBar
  ) {
    // Initialize form immediately in constructor
    this.initializeForm();
  }

  async ngOnInit() {
    // Check if user is logged in
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.snackBar.open('Please log in to create a post', 'Close', { duration: 3000 });
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/new-post' } });
      return;
    }

    this.currentUserId = user.uid;

    // Get user profile to get username
    try {
      const userProfile = await this.authService.getUserProfile(user.uid);
      this.currentUserName = userProfile?.username || user.email || 'Anonymous';
    } catch (error) {
      console.error('Error getting user profile:', error);
      this.currentUserName = user.email || 'Anonymous';
    }

    // Load existing posts
    this.firestoreService.getUserPosts().subscribe((data: UserPost[]) => {
      this.userPosts = data;
    });

    this.formInitialized = true;
  }

  private initializeForm(): void {
    // Initialize form with EMPTY STRINGS instead of null
    this.postForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]],
      img: [''],
      tags: [[]]
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  add(event: any) {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  remove(tag: any) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    // Check if file is an image FIRST
    if (!file.type.match('image.*')) {
      this.snackBar.open('Please select an image file', 'Close', { duration: 3000 });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      this.snackBar.open('Image size should be less than 5MB', 'Close', { duration: 3000 });
      return;
    }

    this.uploadingImage = true;
    this.selectedFile = file;

    // Create preview
    const reader = new FileReader();
    
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.postForm.patchValue({ img: this.imagePreview });
      this.uploadingImage = false;
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      this.snackBar.open('Error reading image file', 'Close', { duration: 3000 });
      this.uploadingImage = false;
    };

    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.uploadingImage = false;
    
    // Only clear the img field if it contains a base64 image
    if (this.postForm.value.img && this.postForm.value.img.startsWith('data:')) {
      this.postForm.patchValue({ img: '' });
    }
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async submitPost() {
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched();

    if (this.postForm.invalid) {
      console.log('Form is invalid. Errors:');
      Object.keys(this.postForm.controls).forEach(key => {
        const control = this.postForm.get(key);
        if (control?.invalid) {
          console.log(`${key}:`, control.errors);
        }
      });
      this.snackBar.open('Please fill out all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    // Double check user is still logged in
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.snackBar.open('Session expired. Please log in again.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    const newPost: UserPost = {
      name: this.postForm.value.name.trim(),
      content: this.postForm.value.content.trim(),
      img: this.postForm.value.img || '',
      postedBy: this.currentUserName,
      authorId: this.currentUserId,
      tags: this.tags,
      createdAt: new Date(),
      comments: [],
      upvotes: 0,
      downvotes: 0
    };

    try {
      await this.firestoreService.addUserPost(newPost);
      this.snackBar.open('✅ Post added successfully!', 'Close', { duration: 3000 });
      
      // Reset form completely
      this.postForm.reset();
      // Reset form controls to empty strings after reset
      this.postForm.patchValue({
        name: '',
        content: '',
        img: '',
        tags: []
      });
      this.tags = [];
      this.imagePreview = null;
      this.selectedFile = null;
      this.uploadingImage = false;
      
      // Navigate to home after successful post
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error adding post:', error);
      this.snackBar.open('❌ Failed to add post. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  // Helper method to show validation errors
  private markFormGroupTouched() {
    Object.keys(this.postForm.controls).forEach(key => {
      const control = this.postForm.get(key);
      control?.markAsTouched();
    });
  }
}