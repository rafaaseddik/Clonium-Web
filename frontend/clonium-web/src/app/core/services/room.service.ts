import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Board} from '../../shared/models/board.model';

import * as io from 'socket.io-client';
import {Player} from '../../shared/models/player.model';
import {Cell} from '../../shared/models/cell.model';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  socket;
  roomID:string;
  playerTwoJoined:Subject<boolean> = new Subject<boolean>();
  move:Subject<{player:Player,x:number,y:number}> = new Subject<{player: Player, x: number, y: number}>();
  constructor(private http: HttpClient) {
    this.socket = io(environment.API_URL);
    this.socket.on("second_player_joined",()=>{
      this.playerTwoJoined.next();
    })
    this.socket.on("move",(player,x,y)=>{
      this.move.next({player,x,y})
    })
  }

  createRoom(mapName:string): Promise<Board> {
    return new Promise<Board>(((resolve, reject) => {
      let body = {
        mapName:mapName
      }
      this.http.post(environment.API_URL + 'room/create', body).subscribe(responseJSON => {
        if (responseJSON['success']) {
          this.roomID = responseJSON['roomID'];
          this.socket.emit("create-room",this.roomID)

          resolve(responseJSON['board'] as Board);

        }else{
          reject()
        }

      }, error => {
        reject(error);
      });
    }));
  }

  joinRoom(roomID: string): Promise<string> {
    return new Promise<string>(((resolve, reject) => {
      const body = {
        roomID: roomID
      };
      this.http.post(environment.API_URL + 'room/join', body).subscribe(responseJSON => {
        if (responseJSON['success']) {
          this.socket.emit("join-room",roomID)
          this.roomID = roomID;
          resolve(responseJSON['board'].board);
        }else{
          reject()
        }

      }, error => {
        reject(error);
      });
    }));
  }
  emitMove(player:Player,cell:Cell){
    let playerNumber = 1;
    switch(player){
      case Player.PLAYER_1:playerNumber = 1;break;
      case Player.PLAYER_2:playerNumber = 2;break;
    }
    this.socket.emit('move',this.roomID,playerNumber,cell.x,cell.y)
  }
}
