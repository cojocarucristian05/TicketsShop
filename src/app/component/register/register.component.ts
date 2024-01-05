import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { AuthorizationService } from 'src/app/shared/authorization.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthorizationService) {}

  ngOnInit(): void {}

  register() {
    if (this.email == '') {
      alert('Please enter email!');
      return;
    }
    if (this.password == '') {
      alert('Please enter password!');
      return;
    }

    this.authService.signUp(this.email, this.password);
    this.email = '';
    this.password = '';
  }
}
