import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../core/services/room.service';
import {GameService} from '../../core/services/game.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html'
})
export class JoinRoomComponent implements OnInit {

  roomID:string="";
  constructor(private router:Router,private roomService:RoomService,private gameService:GameService) { }

  ngOnInit() {
  }

  submit(){
    this.roomService.joinRoom(this.roomID).then(mapName=>{
      this.gameService.joinOnlineBoard(mapName);
      this.router.navigate(['room/online'])
    }).catch(e=>{
      console.error(e);
    })
  }

}
