import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  userData: any;

  constructor(private authService: AuthService) {
    this.authService.userInfoSubscription
      .subscribe(res => this.userData = res);
  }

  logout() {
    this.authService.logout();
  }

  login() {
    this.authService.microsoftSignIn();
  }
}
