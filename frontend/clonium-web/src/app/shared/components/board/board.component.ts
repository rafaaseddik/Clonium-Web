import {Component, Input, OnInit} from '@angular/core';
import {Board} from '../../models/board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit {

  @Input() board: Board;

  constructor() {
  }

  ngOnInit() {
  }

}
