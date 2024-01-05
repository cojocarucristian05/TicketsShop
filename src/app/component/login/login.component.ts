import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { AuthorizationService } from 'src/app/shared/authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthorizationService) {}

  ngOnInit(): void {}

  login() {
    if (this.email == '') {
      alert('Please enter email!');
      return;
    }
    if (this.password == '') {
      alert('Please enter password!');
      return;
    }

    this.authService.signIn(this.email, this.password);
    this.email = '';
    this.password = '';
  }

  signInWithGoogle() {
    this.authService.googleSignIn();
  }
}
