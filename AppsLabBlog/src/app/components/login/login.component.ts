import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Keep this import for Router
import { AuthService } from '../../auth.service'; // Keep this import for AuthService
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MatToolbar] // Only include modules here
})
export class LoginComponent {
  // Correctly declare and initialize the form in one place
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router, // <--- INJECT THE ROUTER HERE
    private auth: AuthService // <--- INJECT THE AUTHSERVICE HERE
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.auth.login(
      this.form.value.email,
      this.form.value.password
    ).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: any) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}