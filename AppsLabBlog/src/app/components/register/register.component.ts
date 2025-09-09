// src/app/components/register/register.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // <--- Import ReactiveFormsModule, FormBuilder, FormGroup, Validators
import { CommonModule } from '@angular/common'; // <--- Import CommonModule for *ngIf

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // <--- Import MatIconModule if you use <mat-icon>
import { MatInputModule } from '@angular/material/input'; // <--- Crucial for Angular Material form fields
import { MatFormFieldModule } from '@angular/material/form-field'; // <--- Crucial for Angular Material form fields

import { Router, RouterModule } from '@angular/router'; // <--- RouterModule for routerLink
import { AuthService } from '../../auth.service'; // <--- Import AuthService, adjust path if needed
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // Or '../styles/auth.css' if you share styles
  imports: [
    CommonModule, // For directives like *ngIf
    ReactiveFormsModule, // <--- Essential for reactive forms
    RouterModule, // For routerLink
    MatButtonModule,
    MatIconModule, // Needed if you use <mat-icon>
    MatInputModule, // For matInput
    MatFormFieldModule, // For mat-form-field
    MatToolbar,
  ],
})
export class RegisterComponent {
  form: FormGroup; // <--- Declare FormGroup
  hidePassword = true;
  loading = false; // <--- Loading state for button
  error: string | null = null; // <--- Error message display

  constructor(
    private fb: FormBuilder, // <--- Inject FormBuilder
    private authService: AuthService, // <--- Inject AuthService
    private router: Router
  ) {
    // <--- Initialize the form in the constructor
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] // Firebase requires min 6 chars
    });
  }

  // <--- Add the submit method
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Show validation errors
      return;
    }

    this.loading = true;
    this.error = null; // Clear previous errors

    const { email, password } = this.form.value;

    this.authService.register(email, password)
      .then(response => {
        console.log('Registration successful:', response);
        // Navigate to dashboard or another appropriate page after successful registration
        this.router.navigate(['/home']);
      })
      .catch(err => {
        this.error = this.getFirebaseErrorMessage(err.code); // Display user-friendly error
        console.error('Registration error:', err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  // Helper for Firebase error messages
  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Invalid email format.';
      case 'auth/operation-not-allowed':
        return 'Email/password registration is not enabled.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      default:
        return 'An unknown error occurred during registration.';
    }
  }

  // Keep your existing navigation methods
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}