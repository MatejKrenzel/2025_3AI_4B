import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  creators = [
    {
      name: 'Michal Czán',
      role: 'Full-Stack Developer',
      github: 'https://github.com/michalczan',
      email: 'michal.czan@example.com',
      description: 'Passionate about creating innovative web solutions and exploring new technologies.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Matej Krenžel',
      role: 'Frontend Developer',
      github: 'https://github.com/matejkrenzel',
      email: 'matej.krenzel@example.com',
      description: 'Focused on creating beautiful user interfaces and seamless user experiences.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulate form submission
      setTimeout(() => {
        this.snackBar.open('Message sent successfully! We\'ll get back to you soon.', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        
        this.contactForm.reset();
        this.isSubmitting = false;
      }, 2000);
    } else {
      this.contactForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  openGithub(url: string) {
    window.open(url, '_blank');
  }

  sendEmail(email: string) {
    window.location.href = `mailto:${email}`;
  }
}