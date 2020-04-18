import {Component, OnInit} from '@angular/core';
import {GameService} from '../../core/services/game.service';
import {Router} from '@angular/router';
import {RoomService} from '../../core/services/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  displayCreateModal = false;
  multiplayerMode = 'single';
  playersNumber:number = 2;
  map = 'rect1';

  constructor(private router: Router, private gameService: GameService,private roomService:RoomService) {
  }

  ngOnInit() {
  }

  createSingleDeviceGame() {
    this.gameService.createBoard(this.map,this.playersNumber);
    this.router.navigate(['room/single-device']);
  }
  createOnlineGame(){
    this.roomService.createRoom(this.map,this.playersNumber).then((roomID)=>{
      this.gameService.createOnlineBoard(this.map,this.playersNumber);
      this.router.navigate(['room/online'])
    });

  }


}
