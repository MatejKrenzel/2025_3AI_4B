import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ContactComponent,
        ReactiveFormsModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contact form with validators', () => {
    expect(component.contactForm.get('name')?.hasError('required')).toBeTruthy();
    expect(component.contactForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.contactForm.get('subject')?.hasError('required')).toBeTruthy();
    expect(component.contactForm.get('message')?.hasError('required')).toBeTruthy();
  });

  it('should navigate to specified route', () => {
    component.navigateTo('home');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should have two creators', () => {
    expect(component.creators.length).toBe(2);
    expect(component.creators[0].name).toBe('Michal Czán');
    expect(component.creators[1].name).toBe('Matej Krenžel');
  });
});