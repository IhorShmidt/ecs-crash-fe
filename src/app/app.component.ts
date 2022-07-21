import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  millis: FormControl;
  form;

  intervals = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      value: new FormControl(0),
      millis: new FormControl(250)
    });
  }

  startHittingServer(): void {
    this.stopHittingServer();
    this.intervals.push(
      setInterval(() => {
        this.sendValueRequest();
      }, this.form.get('millis').value)
    );

  }

  stopHittingServer(): void {
    this.intervals.forEach(interval => {
      clearInterval(interval);
    });
  }

  sendValueRequest(): void {

    const value = this.form.get('value').value;
    this.http.get(`${environment.api}/value?value=${value}`).subscribe((data: { value: number }) => {
        console.log(data);
        this.form.get('value').setValue(++data.value);
      }
      , error => {
        console.log(error);
      }
    );

  }

  sendCrashRequest(): void {
    this.http.get(`${environment.api}/crash`).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      }
    );

  }
}
