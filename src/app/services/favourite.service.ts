import { Injectable } from '@angular/core';
import { Favourite } from './favourite';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AuthService } from './auth.service';

@Injectable()
export class FavouriteService {

  private basePath = '/Favourites/';
  itemsRef: AngularFireList<Favourite>;
  itemRef: AngularFireObject<Favourite>;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, public authService: AuthService) {
    this.itemsRef = db.list(this.basePath);
  }

  getItemsList(username?): Observable<Favourite[]> {
    this.itemsRef = this.db.list(this.basePath + username);
    return this.itemsRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }));
    });
  }

  getItem(key: string): Observable<Favourite | null> {
    const itemPath = `${this.basePath}/${key}`;
    const item = this.db.object(itemPath).valueChanges() as Observable<Favourite | null>;
    return item;
  }

  createItem(item: Favourite): void {
    console.log('Value: ' + item.name);
    console.log('Img url: ' + item.photoUrl);
    console.log('URL: ' + item.url);
    console.log('Calories: ' + item.calories);
    console.log('added to the database.');
    this.itemsRef.push(item);
  }

  deleteItem(key: string): void {
    console.log('Deleted recipe with key: ' + key);
    this.itemsRef.remove(key);
  }

  deleteAll(): void {
    this.itemsRef.remove();
  }
}

