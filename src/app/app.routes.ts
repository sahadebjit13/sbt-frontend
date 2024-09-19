import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './authentication/auth.guard';

export const routes: Routes = [
    {component: LoginComponent, path: 'login'},
    {component: RegistrationComponent, path: 'registration'},
    {component: PasswordChangeComponent, path: 'password-change'},
    {component: DashboardComponent, path: 'dashboard', canActivate: [AuthGuard]},
    {redirectTo: '/login', path: '', pathMatch:'full'}
];
