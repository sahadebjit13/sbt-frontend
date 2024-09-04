import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  title = 'Registration'

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.isValidName = ''
    this.isValidEmail = ''
    this.isValidPhone = ''
    this.isValidPassword = ''
  }

  registrationForm!: FormGroup

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNo: ['', Validators.required],
      email: [''],
      password: ['', [Validators.minLength(8)]]
    });
  }

  isValidName!: string
  isValidEmail!: string
  isValidPhone!: string
  isValidPassword!: string

  inputFirstName!: string
  inputLastName!: string
  inputPhone!: string
  inputEmail!: string
  inputPassword!: string
  emailRegex = /^[a-zA-Z]+[a-zA-Z0-9\.]*[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z\.]*[a-zA-Z]+$/
  nameRegex = /^[A-Z]([A-Z][a-z]*\w)+$/
  phoneRegex = /\d{10}/
  
  // nameVisible = 'hidden'
  // phoneVisible = 'hidden'
  // emailVisible = 'hidden'
  // passwordVisible = 'hidden'

  // visibility(index: number){
  //   if (index == 1) {
  //     this.nameVisible = 'nameVisible'
  //   } else if (index == 2) {
  //     this.nameVisible = 'nameVisible'
  //   } else if (index == 3) {
  //     this.phoneVisible = 'phoneVisible'
  //   } else if (index == 4) {
  //     this.emailVisible = 'emailVisible'
  //   } else if (index == 5) {
  //     this.passwordVisible = 'passwordVisible'
  //   }
  // }
  
    
   // Actual registration
  user = { firstName: '', lastName: '', email: '', password: '', phoneNo: '', role: 'USER' };

  usernameError: string | null = null;
  isUsernameAvailable: boolean = false;

  

  register() {
    if (this.registrationForm.valid) {
      this.authService.register(this.user).subscribe(
        response => {
          console.log(this.registrationForm.value);
          
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Registration failed:', error);
          this.usernameError = error.error.error || 'Registration failed';
        }
      );
    }
  }
  
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
  // validateName(inputFirstName: string, inputLastName: string){
  //   if(inputFirstName.length == 0 || inputLastName.length == 0)
  //   {
  //     this.isValidName = '*Name field cannot be empty'
  //     return true
  //   }
  //   else{
  //     this.isValidName = '*Enter a valid name'
  //     return this.nameRegex.test(inputFirstName) && this.nameRegex.test(inputLastName)
  //   }
  // }
  // validatePhone(inputPhone: string){
  //   if(inputPhone.length == 0){
  //     this.isValidPhone = '*Phone field cannot be empty'
  //     return true
  //   }
  //   else if(inputPhone.length != 10 || !this.phoneRegex.test(inputPhone)){
  //     this.isValidPhone = '*Please enter a valid phone'
  //     return true
  //   }
  //   else{
  //     this.isValidPassword = ''
  //     return false
  //   }
  // }
  // validatePassword(inputPassword: string){
  //   if(inputPassword.length == 0){
  //     this.isValidPassword = '*Password field cannot be empty'
  //     return true
  //   }
  //   else if(inputPassword.length < 8){
  //     this.isValidPassword = '*Password length must be at least 8 characters'
  //     return true
  //   }
  //   else{
  //     this.isValidPassword = ''
  //     return false
  //   }
  // }




}
