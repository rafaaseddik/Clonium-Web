import { Component, OnInit } from '@angular/core';
import {Board} from '../../shared/models/board.model';
import {GameService} from '../../core/services/game.service';
import {Player} from '../../shared/models/player.model';
import {Router} from '@angular/router';

/**
 * @description
 * Gets the game configuration form the GameService and dispatches the configuration to it's child board.component
 * If no configuration is found : go to home screen
 * @author
 * Rafaa Seddik
 */
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class OnlineRoomComponent implements OnInit {

  board: Board;
  currentPlayer:Player;
  isOnline= true;
  constructor(private router:Router,private gameService:GameService) { }

  ngOnInit() {

    if(this.gameService.currentBoard){
      this.board = this.gameService.currentBoard;
      this.currentPlayer = this.gameService.curentPlayer;
    }
    else {
      this.router.navigate(['home']);
    }
  }

}
