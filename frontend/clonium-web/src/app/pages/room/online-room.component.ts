import { Component, OnInit } from '@angular/core';
import {Board} from '../../shared/models/board.model';
import {GameService} from '../../core/services/game.service';
import {Player} from '../../shared/models/player.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class OnlineRoomComponent implements OnInit {

  board: Board;
  currentPlayer:Player
  isOnline= true;
  constructor(private gameService:GameService) { }

  ngOnInit() {
    this.board = this.gameService.currentBoard;
    this.currentPlayer = this.gameService.curentPlayer;
  }

}
