import { Component, OnInit, Input } from '@angular/core';
import { FavouriteService } from '../services/favourite.service';
import { Favourite } from '../services/favourite';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {

  @Input() favourite: Favourite;
  favourites: Observable<Favourite[]>;

  constructor(private favouriteService: FavouriteService, public authService: AuthService) {
    this.favourites = this.favouriteService.getItemsList();
  }


ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.favourites = this.favouriteService.getItemsList(auth.displayName);
        console.log('Wykryto użytkownika: ' + auth.displayName + ', podpinam do osobistej bazy ulubionych.');
      }
    });
}

deleteItem(key) {
  this.favouriteService.deleteItem(key);
}

deleteItems() {
  this.favouriteService.deleteAll();
}

}
