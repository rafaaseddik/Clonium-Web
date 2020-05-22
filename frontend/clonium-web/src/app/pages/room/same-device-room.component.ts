import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GameService} from '../../core/services/game.service';
import {Board} from 'src/app/shared/models/board.model';
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
export class SameDeviceRoomComponent implements OnInit{

  board: Board;
  isOnline= false;
  constructor(private router: Router, private gameService: GameService) {

  }

  ngOnInit() {
    if(this.gameService.currentBoard) {
      this.board = this.gameService.currentBoard;
      this.board.presentPlayers = this.board.playersNumber;
    }
    else {
      this.router.navigate(['home']);
    }
  }


}
