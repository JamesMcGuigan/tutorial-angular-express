import { Component } from '@angular/core';
import { Http } from '@angular/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})


export class AppComponent {
  message = 'oracle-eye';
  name  = ''

  // DOCS: https://stackoverflow.com/questions/34802813/how-to-make-ajax-call-with-angular2ts
  constructor(public http: Http) {
    this.onChange();
  }

  onChange() {
    this.http.get(`/api/hello?name=${this.name}`)
      .subscribe(response => {
        this.message = response.json().message;
      });        
  }

  // DOCS: https://angular.io/guide/two-way-binding
  onUpdateName(name: string) {
    this.name = name;
    this.onChange()
  }
}



