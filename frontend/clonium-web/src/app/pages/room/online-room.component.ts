import { Component, OnInit } from '@angular/core';
import {Board} from '../../shared/models/board.model';
import {GameService} from '../../core/services/game.service';
import {Player} from '../../shared/models/player.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class OnlineRoomComponent implements OnInit {

  board: Board;
  currentPlayer:Player
  isOnline= true;
  constructor(private router:Router,private gameService:GameService) { }

  ngOnInit() {

    if(this.gameService.currentBoard){
      this.board = this.gameService.currentBoard;
      this.currentPlayer = this.gameService.curentPlayer;
    }
    else {
      // check persisted session

      this.router.navigate(['home']);
    }
  }

}
