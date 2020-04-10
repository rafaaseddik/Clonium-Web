import {Component} from '@angular/core';
import {RectangularLayout} from './shared/config/board-layouts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clonium-web';
  b;

  constructor() {
    this.b = RectangularLayout(8, 3);
  }
}
