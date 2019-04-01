import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public email: string;
  public password: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onSubmitLogin() {
    this.authService.loginUserByEmail(this.email, this.password)
      .then((res) => {
        this.flashMessage.show('You has been succesfully logged in to your account!',
        {cssClass: 'alert-success', timeout: 4000});
        this.router.navigate(['/']);
      }).catch((err) => {
        this.flashMessage.show(err.message,
        {cssClass: 'alert-success', timeout: 4000});
        console.log(err);
        this.router.navigate(['/login']);
      });
  }
  onClickGoogleLogin() {
    this.authService.loginUserByGoogle()
    .then((res) => {
      this.router.navigate(['/']);
    }).catch(err => console.log(err.message));
  }
  onClickFacebookLogin() {
    this.authService.loginUserByFacebook()
    .then((res) => {
      this.router.navigate(['/']);
    }).catch(err => console.log(err.message));
  }
  onClickTwitterLogin() {
    this.authService.loginUserByTwitter()
    .then((res) => {
      this.router.navigate(['/']);
    }).catch(err => console.log(err.message));
  }
}
