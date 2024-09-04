import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})
export class PasswordChangeComponent {
  title = 'Sign in'
  invalid;
  isValidEmail;
  inputPassword = ''
  inputEmail = ''
  emailRegex = /^[a-zA-Z]+[a-zA-Z0-9\.]*[a-zA-Z0-9]+@{1}[a-zA-Z]+\.[a-zA-Z]+$/

  
  constructor(){
    this.invalid = ''
    this.isValidEmail = ''
  }
  
  validateEmail(inputEmail: string){
    if(inputEmail.length == 0)
    {
      this.isValidEmail = '*Email field cannot be empty'
      return true
    }
    else{
      this.isValidEmail = '*Enter a valid email'
      return !this.emailRegex.test(inputEmail)
    }
  }
  validatePassword(inputPassword: string){
    if(inputPassword.length == 0){
      this.invalid = '*Password field cannot be empty'
      return true
    }
    else if(inputPassword.length < 8){
      this.invalid = '*Please enter a valid password'
      return true
    }
    else{
      this.invalid = ''
      return false
    }
  }
}
