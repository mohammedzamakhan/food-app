import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { merge, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';

const HOST = 'http://192.168.1.68:5000';
const FOODS_URL = `${HOST}/foods`;
const SUBSCRIPTION_URL = `${HOST}/subscribe`;
const VAPID_KEY = 'BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'food-app';
  foods$;
  food = '';
  newFoodsFromPost$ = new Subject();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.foods$ = merge(
      this.http.get(FOODS_URL).pipe(catchError((err) => {
        this.snackBar.open(`Error in fetching data ${JSON.stringify(err)}`);
        return '';
      })),
      this.newFoodsFromPost$,
    );
  }

  onSubscribe() {
    alert('Implement Push Notification Subscription!');
  }

  addFood() {
    if (this.food) {
      this.http.post(FOODS_URL, {
        food: this.food
      }).subscribe(foods => {
        this.newFoodsFromPost$.next(foods);
        this.food = '';
      });
    }
  }
}
