import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../core/services/room.service';
import {GameService} from '../../core/services/game.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

/**
 * @description
 * This screen to join an online room by the roomID
 *
 * @author
 * Rafaa Seddik
 */
@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html'
})
export class JoinRoomComponent implements OnInit {

  // The input roomID value
  roomID:string="";

  constructor(private router:Router,private roomService:RoomService,private gameService:GameService) { }

  ngOnInit() {
  }

  /**
   * @description
   * Checks if there is an available place in the room
   * if successful, go to the online-room.component
   * else, show an alert
   *
   * @author
   * Rafaa Seddik
   */
  submit(){
    this.roomService.joinRoom(this.roomID).then(result=>{
      this.gameService.joinOnlineBoard(result.mapName,result.playersNumber,result.currentPlayer,result.side);
      this.router.navigate(['room/online'])
    }).catch(e=>{
      Swal.fire({html:'Room not found',icon:'error'})
    })
  }

}
