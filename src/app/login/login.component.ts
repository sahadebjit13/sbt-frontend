import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'Sign in'

  loginForm!: FormGroup
  // invalid = ''
  // isValidEmail = ''
  // inputPassword = ''
  // inputEmail = ''
  // emailRegex = /^[a-zA-Z]+[a-zA-Z0-9\.]*[a-zA-Z0-9]+@{1}[a-zA-Z]+\.[a-zA-Z]+$/

  
  
  
  // validateEmail(inputEmail: string){
  //   if(inputEmail.length == 0)
  //   {
  //     this.isValidEmail = '*Email field cannot be empty'
  //     return true
  //   }
  //   else{
  //     this.isValidEmail = '*Enter a valid email'
  //     return !this.emailRegex.test(inputEmail)
  //   }
  // }
  // validatePassword(inputPassword: string){
  //   if(inputPassword.length == 0){
  //     this.invalid = '*Password field cannot be empty'
  //     return true
  //   }
  //   else if(inputPassword.length < 8){
  //     this.invalid = '*Please enter a valid password'
  //     return true
  //   }
  //   else{
  //     this.invalid = ''
  //     return false
  //   }
  // }

  // Actual login logic
  loginData = { email: '', password: '' };
  loginError: string | null = null;
  isAuthenticated: boolean = false;
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {}

  disableToggle = true
  checkLoginFieldsToDisable() {
    if(this.loginData.email.length == 0 && this.loginData.password.length == 0)
    {
      this.disableToggle = true
    } else {
      this.disableToggle = false
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  login() {
    this.authService.login(this.loginData).subscribe(
      () => {
        // Navigate to the dashboard after successful login
        this.router.navigate(['/dashboard']);
        this.isAuthenticated = true;
      },
      error => {
        console.error('Login failed:', error);
        this.loginError = 'Invalid username or password';
      }
    );
  }
}
