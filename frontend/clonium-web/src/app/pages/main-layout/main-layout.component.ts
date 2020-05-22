import {Component, OnInit} from '@angular/core';

/**
 * The main layout container
 */
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit {

  /**
   * @deprecated
   * TODO : Remove Header from the codebase
   */
  showHeader = false;

  constructor() {
  }

  ngOnInit() {
  }

}
