import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GameService} from '../../core/services/game.service';
import {Board} from 'src/app/shared/models/board.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class SameDeviceRoomComponent implements OnInit, AfterViewInit {

  board: Board;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.board = this.gameService.currentBoard;
  }

  ngAfterViewInit(): void {
  }

}
