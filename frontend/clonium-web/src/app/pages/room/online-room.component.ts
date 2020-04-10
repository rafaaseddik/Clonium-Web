import { Component, OnInit } from '@angular/core';
import {Board} from '../../shared/models/board.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class OnlineRoomComponent implements OnInit {

  board: Board;
  constructor() { }

  ngOnInit() {
  }

}
