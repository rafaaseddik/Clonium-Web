import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../core/services/room.service';
import {GameService} from '../../core/services/game.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
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
    this.roomService.joinRoom(this.roomID).then(result=>{
      this.gameService.joinOnlineBoard(result.mapName,result.playersNumber,result.currentPlayer,result.side);
      this.router.navigate(['room/online'])
    }).catch(e=>{
      Swal.fire({html:'Room not found',icon:'error'})
    })
  }

}
