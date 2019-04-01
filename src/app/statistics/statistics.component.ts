import { Component, OnInit, Input } from '@angular/core';
import { FavouriteService } from '../services/favourite.service';
import { Favourite } from '../services/favourite';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { AngularBillboardService } from 'angular-billboard';
import { element } from 'protractor';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  @Input() favourite: Favourite;
  favourites: Observable<Favourite[]>;
  caloriesTab = [''];
  namesTab = ['x'];
  chartsOptions: any[];
  charts: any[];
  graph = false;
  buttonVisible = false;
  constructor(private favouriteService: FavouriteService, public authService: AuthService,
     private angularBillboardService: AngularBillboardService) {
    this.favourites = this.favouriteService.getItemsList();
  }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.favourites = this.favouriteService.getItemsList(auth.displayName);
        console.log('Wykryto użytkownika: ' + auth.displayName + ', podpinam do osobistej bazy statystyk.');
        this.addChart();
        this.buttonVisible = true;
      }
    });
}

  addChart() {
    this.favourites.forEach(favouriteObject => {
      favouriteObject.forEach(inside => {
        this.caloriesTab.push(inside.calories + '');
        this.namesTab.push(inside.name);
      });
    });
  }

  showGraph() {
    console.log('After button click: ' + this.namesTab + this.caloriesTab);
    /* wywietl graf */
    this.chartsOptions = [
      {
          data:  {
              x: 'x',
              columns: [
                  this.namesTab,
                  this.caloriesTab
              ]
              ,
              type: 'bar'
          },
          axis: {
            x: {
              type: 'category',
              tick: {
                rotate: 20,
                multiline: false,
                tooltip: true
              },
              height: 130
            }
          }
      }
  ];
  this.charts = this.angularBillboardService.generate(...this.chartsOptions);
  this.graph = true;
  }
}
