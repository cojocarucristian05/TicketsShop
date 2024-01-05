import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from 'src/app/shared/authorization.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userInfo: string = '';

  constructor(private router: Router, private authService: AuthorizationService) {}

  ngOnInit() {
    this.showInfo();
  }

  showNavbar(): boolean {
    return this.router.url !== '/login' &&
           this.router.url !== '/register' &&
           this.router.url !== '/forgot-password' &&
           this.router.url !== '/verify-email';
  }

  showMyEvents(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.authService.hasAuthorRole().subscribe(result => {
        resolve(result);
      });
    });
  }

  showDashboard(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.authService.hasAdminRole().subscribe(result => {
        resolve(result);
      });
    });
  }

  showInfo() {
    const emailWithQuotes = JSON.stringify(localStorage.getItem('token'));
    const email = emailWithQuotes.substring(1, emailWithQuotes.length - 1);
    this.authService.getUser(email).subscribe(
      res => {
        this.userInfo = res?.username || 'Info';
      },
      error => {
        console.error('Error fetching user info:', error);
        this.userInfo = 'Info'; // Set a default value in case of an error
      }
    );  
  }
}
