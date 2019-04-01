import { Component, OnInit, Input } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations'; // important, animation
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { CookieService } from 'ngx-cookie';
import { BrowserModule } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { app } from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { createWiresService } from 'selenium-webdriver/firefox';
import { AuthService } from '../../services/auth.service';
import { FavouriteService } from '../../services/favourite.service';
import { Favourite } from '../../services/favourite';

@Component({  // don't touch this section. It is responsible for animation of the list.
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('products', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true }),

        query(':leave', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ])

  ]
})

export class SearchComponent implements OnInit {

  isLoggedIn: boolean;
  isProduct;
  itemCount;
  i;
  favourite: Favourite = new Favourite();
  buttonText = 'Add an product';
  productText = ''; /* product that you write down in search */
  productTab = []; /* array - virtual fridge */
  cookieTab;
  productsToText = ''; /* variable for storing products from array to text with coma */
  apiKey = '&app_id=51498885&app_key=13987527ce597b2b662dc0fa755c4054'; /* api key and id */
  apiRoot = 'https://api.edamam.com/search?q='; /* api website with search?q section */
  data: any; /* variable for storing api results */

  constructor(private http: HttpClient, private _cookieService: CookieService, private data2: AuthService
    , private favouriteService: FavouriteService) { }


  @Input()
  favourites: Observable<Favourite[]>;

  ngOnInit() {
    this.data2.currentMessage.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    this.productsFromCookie();
    this.itemCount = this.productTab.length; // on init count products
    this.productCheck();
    this.data2.getAuth().subscribe(auth => {
      if (auth) {
        this.favourites = this.favouriteService.getItemsList(auth.displayName);
        console.log('Wykryto użytkownika: ' + auth.displayName + ', podpinam do osobistej bazy ulubionych.');
      }
    });
  }

  createFavourite(name, img, url, calories) {
    this.favourite.name = name;
    this.favourite.photoUrl = img;
    this.favourite.url = url;
    this.favourite.calories = calories;
    this.favouriteService.createItem(this.favourite);
    this.favourite = new Favourite();
  }

  productCheck() {
    if (this.itemCount === 0) {
      this.isProduct = false;
      this._cookieService.removeAll();
    } else { this.isProduct = true; }
  }

  productsFromCookie() { /* getting products from cookie */
    this.cookieTab = this._cookieService.getAll();
    console.log(this._cookieService.getAll());
    for (this.i = 0; ; this.i++) {
      if (this.cookieTab[this.i] === undefined) { console.log('Cookie wczytane'); break; }
      // tslint:disable-next-line:one-line
      else { this.productTab[this.i] = this.cookieTab[this.i]; }
    }
    console.log(this.productTab);
  }

  addItem() {
    if (this.productText === '') { } else { // if chosen product is empty do nothing
      this.productTab.push(this.productText);  // else add to the array
      this._cookieService.put(this.itemCount, this.productText);
      console.log('adding "' + this.productText + '" to cookies.');
      this.productText = ''; // reset productText field
      this.itemCount = this.productTab.length; // item count++
      this.productCheck();
    }
  }

  removeItem(i) { /* method responsible for remove item from your virtual fridge */
    console.log('Cookie "' + this.productTab[i] + '" usuniete');
    this.productTab.splice(i, 1);
    this._cookieService.remove(i);
    this.itemCount = this.productTab.length;
    this.productCheck();
    console.log(this.productTab);
  }

  getFromApi(url: string) {/* get data from api to data variable and write it down in console */
    this.http.get<any>(url).subscribe(posts => {
      this.data = posts;
      console.log(this.data);
    });
  }

  searchRecipes() { /* create products separated by comas and create a query for api */
    this.productsToText = '';
    this.productTab.forEach(element => {
      this.productsToText += element + ',';
    });
    const url = `${this.apiRoot}` + this.productsToText + this.apiKey;
    console.log(this.productsToText);
    this.getFromApi(url);
  }
}
