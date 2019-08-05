import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { merge, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';

const URL = 'http://localhost:5000/foods';
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
      this.http.get(URL).pipe(catchError((err) => {
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
      this.http.post(URL, {
        food: this.food
      }).subscribe(foods => {
        this.newFoodsFromPost$.next(foods);
        this.food = '';
      });
    }
  }
}
