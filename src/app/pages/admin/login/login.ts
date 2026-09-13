import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  submitting =
    signal(false);

  error =
    signal<string | null>(null);


  loginForm = this.fb.nonNullable.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]

  });


  // ========================================
  // SUBMIT
  // ========================================

  submit(): void {

    if (
      this.loginForm.invalid
    ) {

      this.loginForm.markAllAsTouched();

      return;
    }


    this.submitting.set(true);

    this.error.set(null);


    this.authService
      .login(
        this.loginForm.getRawValue()
      )
      .subscribe({

        next: response => {

          this.authService
            .setSession(response);


          this.router.navigate([
            '/admin'
          ]);

        },


        error: error => {

          console.error(
            'Login failed:',
            error
          );


          if (
            error.status === 401
          ) {

            this.error.set(
              'Invalid email or password.'
            );

          } else {

            this.error.set(
              'Unable to sign in. Please try again.'
            );

          }


          this.submitting.set(false);

        }

      });

  }
}
