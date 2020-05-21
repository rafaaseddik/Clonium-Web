import {Component, OnInit} from '@angular/core';
import {GameService} from '../../core/services/game.service';
import {Router} from '@angular/router';
import {RoomService} from '../../core/services/room.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  displayCreateModal = false;
  multiplayerMode = 'single';
  playersNumber: number = 2;
  map = 'rect1';
  showRules = false;
  side: number = 8;
  hasSession: boolean = false;

  constructor(private router: Router, private gameService: GameService, private roomService: RoomService) {
    this.hasSession = this.roomService.getStoredSession();
  }

  ngOnInit() {
  }


  createGame() {
    if (this.multiplayerMode == 'single') {
      this.createSingleDeviceGame();
    } else {
      this.createOnlineGame();
    }
  }

  createSingleDeviceGame() {
    this.gameService.createBoard(this.map, this.playersNumber, this.side);
    this.router.navigate(['room/single-device']);
  }

  createOnlineGame() {
    this.roomService.createRoom(this.map, this.playersNumber, this.side).then((roomID) => {
      this.gameService.createOnlineBoard(this.map, this.playersNumber, this.side);
      this.router.navigate(['room/online']);
    });

  }

  selectGameMode(mode: string) {
    this.multiplayerMode = mode;
  }

  selectMap(mapName: string) {
    this.map = mapName;
  }

  joinOldSession() {

    this.roomService.rejoinRoom().then(result => {
      this.gameService.joinOnlineBoard(result.mapName, result.playersNumber, result.currentPlayer, result.side,result.serialBoard,result.currentState);
      console.log(result.serialBoard)
      this.router.navigate(['room/online']);
    }).catch(e => {
      console.error(e)
      Swal.fire({html: 'Room not found', icon: 'error'})
    })
  }


}
