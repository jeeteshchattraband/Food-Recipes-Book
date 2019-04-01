import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public email: string;
  public password: string;
  constructor(
    public authService: AuthService,
    public router: Router,
    public flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
  }

  onSubmitAddUser() {
    this.authService.registerUser(this.email, this.password)
    .then((res) => {
      this.flashMessage.show('Your account has been successfully created!', {cssClass: 'alert-success', timeout: 4000});
      this.router.navigate(['/']);
      console.log(res);
    }).catch((err) => {
      this.flashMessage.show(err.message, {cssClass: 'alert-success', timeout: 4000});
      console.log(err);
    });
  }
}
