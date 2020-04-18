import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Board} from '../../shared/models/board.model';

import * as io from 'socket.io-client';
import {Player} from '../../shared/models/player.model';
import {Cell} from '../../shared/models/cell.model';
import {Subject} from 'rxjs';
import {Message} from '../../shared/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  socket;
  roomID:string;
  playerTwoJoined:Subject<boolean> = new Subject<boolean>();
  playerThreeJoined:Subject<boolean> = new Subject<boolean>();
  playerFourJoined:Subject<boolean> = new Subject<boolean>();

  move:Subject<{player:Player,x:number,y:number}> = new Subject<{player: Player, x: number, y: number}>();

  receiveMessage:Subject<Message> = new Subject<Message>();
  constructor(private http: HttpClient) {
    this.socket = io(environment.API_URL);
    this.socket.on("second_player_joined",()=>{
      this.playerTwoJoined.next();
    });
    this.socket.on("third_player_joined",()=>{
      this.playerThreeJoined.next();
    });
    this.socket.on("fourth_player_joined",()=>{
      this.playerFourJoined.next();
    });
    this.socket.on("move",(player,x,y)=>{
      this.move.next({player,x,y})
    })
  }

  createRoom(mapName:string,playersNumber:number): Promise<Board> {
    return new Promise<Board>(((resolve, reject) => {
      let body = {
        mapName:mapName,
        playersNumber:playersNumber
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

  joinRoom(roomID: string): Promise<{mapName:string,playersNumber:number,currentPlayer:Player}> {
    return new Promise(((resolve, reject) => {
      const body = {
        roomID: roomID
      };
      this.http.post(environment.API_URL + 'room/join', body).subscribe(responseJSON => {
        if (responseJSON['success']) {
          this.socket.emit("join-room",roomID,responseJSON['board']['currentPlayerNumber']);
          this.roomID = roomID;
          let currentPlayer:Player;
          switch(responseJSON['board']['currentPlayerNumber']){
            case 1:currentPlayer=Player.PLAYER_1;break;
            case 2:currentPlayer=Player.PLAYER_2;break;
            case 3:currentPlayer=Player.PLAYER_3;break;
            case 4:currentPlayer=Player.PLAYER_4;break;
            default:currentPlayer = Player.PLAYER_2;
          }
          resolve(
            {mapName:responseJSON['board'].room.board,playersNumber:responseJSON['board'].room.playersNumber,currentPlayer:currentPlayer})
        }else{
          reject()
        }

      }, error => {
        reject(error);
      });
    }));
  }
  getConnectedPlayers(roomID:string):Promise<number>{
    return new Promise<number>(((resolve, reject) => {
      const body = {
        roomID: roomID
      };
      this.http.post(environment.API_URL + 'room/getConnectedPlayers', body).subscribe(responseJSON => {
        resolve(responseJSON['result'])
      },error=>{
        reject()
      })
    }))
  }
  emitMove(player:Player,cell:Cell){
    let playerNumber = 1;
    switch(player){
      case Player.PLAYER_1:playerNumber = 1;break;
      case Player.PLAYER_2:playerNumber = 2;break;
      case Player.PLAYER_3:playerNumber = 3;break;
      case Player.PLAYER_4:playerNumber = 4;break;
    }
    this.socket.emit('move',this.roomID,playerNumber,cell.x,cell.y)
  }
}
