import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user = {
    username: '',
    email: ''
  };

  onSubmit() {
    console.log('Submitted:', this.user);
  }
}
