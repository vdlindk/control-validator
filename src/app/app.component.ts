import { Component, VERSION } from '@angular/core';
import { MyModel } from './my-model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  myModel: MyModel = {
    myValue: 'hello',
  };
}
