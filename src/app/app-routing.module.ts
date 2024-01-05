import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { HomeComponent } from './component/home/home.component';
import { MyEventsComponent } from './component/my-events/my-events.component';
import { ProfileComponent } from './component/profile/profile.component';

const routes: Routes = [
  {
    path : "", 
    redirectTo : "login", 
    pathMatch : "full"
  },
  {
    path : "login", 
    component : LoginComponent
  },
  {
    path : "register", 
    component : RegisterComponent
  },
  {
    path : "dashboard", 
    component : DashboardComponent
  },
  {
    path : "forgot-password", 
    component : ForgotPasswordComponent
  },
  {
    path : "verify-email", 
    component : VerifyEmailComponent
  },
  {
    path : "home",
    component : HomeComponent
  },
  {
    path : "my-events",
    component : MyEventsComponent
  },
  {
    path : "profile",
    component : ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
