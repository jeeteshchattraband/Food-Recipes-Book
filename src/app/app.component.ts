import { Component, OnInit } from '@angular/core';
import fontawesome from '@fortawesome/fontawesome';
import faTrashAlt from '@fortawesome/fontawesome-free-regular/';
import { AuthService } from './services/auth.service';
import { FavouriteService } from '../app/services/favourite.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor() {
  }
}
