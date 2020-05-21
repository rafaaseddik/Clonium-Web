import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Board} from '../../shared/models/board.model';

import * as io from 'socket.io-client';
import {Player} from '../../shared/models/player.model';
import {Cell} from '../../shared/models/cell.model';
import {Subject} from 'rxjs';
import {Message} from '../../shared/models/message.model';
import {GameService} from './game.service';
import {GameState} from '../../shared/models/game-state.model';
import {nextGameState} from '../../shared/utils/utilFunctions';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  socket;
  roomID:string;
  // Joined
  playerOneJoined:Subject<boolean> = new Subject<boolean>();
  playerTwoJoined:Subject<boolean> = new Subject<boolean>();
  playerThreeJoined:Subject<boolean> = new Subject<boolean>();
  playerFourJoined:Subject<boolean> = new Subject<boolean>();

  move:Subject<{player:Player,x:number,y:number}> = new Subject<{player: Player, x: number, y: number}>();

  receiveMessage:Subject<Message> = new Subject<Message>();
  currentPlayerNumber:number=0;
  cachedBoardCells:Cell[][];
  constructor(private http: HttpClient,private gameService:GameService) {
    this.socket = io(environment.API_URL);
    this.socket.on("first_player_joined",(toggle)=>{
      console.log("first_player_joined")
      this.playerOneJoined.next(toggle);
    });
    this.socket.on("second_player_joined",(toggle)=>{
      console.log("second_player_joined")
      this.playerTwoJoined.next(toggle);
    });
    this.socket.on("third_player_joined",(toggle)=>{
      console.log("third_player_joined")
      this.playerThreeJoined.next(toggle);
    });
    this.socket.on("fourth_player_joined",(toggle)=>{
      console.log("fourth_player_joined")
      this.playerFourJoined.next(toggle);
    });
    this.socket.on("move",(player,x,y)=>{
      this.move.next({player,x,y})
    });
    this.socket.on("ping",callback=>{
      this.socket.emit("ping-response",this.roomID,this.currentPlayerNumber)
    });
    this.socket.on("receive-message",(message,player)=>{
      this.receiveMessage.next(new Message(player,message))
    })
  }

  createRoom(mapName:string,playersNumber:number,side:number): Promise<Board> {
    return new Promise<Board>(((resolve, reject) => {
      let body = {
        mapName:mapName,
        playersNumber:playersNumber,
        side:side
      }
      this.http.post(environment.API_URL + 'room/create', body).subscribe(responseJSON => {
        if (responseJSON['success']) {
          this.roomID = responseJSON['roomID'];
          this.socket.emit("create-room",this.roomID)
          this.currentPlayerNumber = 1;
          this.persistSession();
          resolve(responseJSON['board'] as Board);

        }else{
          reject()
        }

      }, error => {
        reject(error);
      });
    }));
  }

  joinRoom(roomID: string): Promise<{mapName:string,playersNumber:number,currentPlayer:Player,side:number}> {
    return new Promise(((resolve, reject) => {
      const body = {
        roomID: roomID
      };
      this.http.post(environment.API_URL + 'room/join', body).subscribe(responseJSON => {
        if (responseJSON['success']) {
          this.socket.emit("join-room",roomID,responseJSON['board']['currentPlayerNumber']);
          this.currentPlayerNumber = responseJSON['board']['currentPlayerNumber'];
          this.roomID = roomID;
          this.persistSession();
          let currentPlayer:Player;
          switch(responseJSON['board']['currentPlayerNumber']){
            case 1:currentPlayer=Player.PLAYER_1;break;
            case 2:currentPlayer=Player.PLAYER_2;break;
            case 3:currentPlayer=Player.PLAYER_3;break;
            case 4:currentPlayer=Player.PLAYER_4;break;
            default:currentPlayer = Player.PLAYER_2;
          }
          resolve(
            {
              mapName:responseJSON['board'].room.board,
              playersNumber:responseJSON['board'].room.playersNumber,
              currentPlayer:currentPlayer,
              side:responseJSON['board'].room.side})
        }else{
          reject()
        }

      }, error => {
        reject(error);
      });
    }));
  }
  rejoinRoom():Promise<{mapName:string,playersNumber:number,currentPlayer:Player,side:number,serialBoard:string,currentState:GameState}>{
    return new Promise(((resolve, reject) => {
      console.log(localStorage.getItem('clonium-session'))
      let {socketID,roomID} = JSON.parse(localStorage.getItem('clonium-session'))
      this.socket.emit('rejoin-room',socketID,(roomIDWS,playerNumber,mapName,playersNumber,side,serialBoard,lastPlayed)=>{
        console.log(roomIDWS,playerNumber,mapName,playersNumber,side)
        if(roomIDWS == roomID){
          this.socket.emit("join-room",roomID,playerNumber);
          this.roomID = roomID;
          this.persistSession();
          let currentPlayer:Player;
          this.currentPlayerNumber = playerNumber;
          switch(playerNumber){
            case 1:currentPlayer=Player.PLAYER_1;break;
            case 2:currentPlayer=Player.PLAYER_2;break;
            case 3:currentPlayer=Player.PLAYER_3;break;
            case 4:currentPlayer=Player.PLAYER_4;break;
            default:currentPlayer = Player.PLAYER_2;
          }

          let currentState:GameState;
          if(lastPlayed==0){
            currentState = GameState.PLAYER_1
          }else{
            let lastPlayingPlayer:Player;
            switch(lastPlayed){
              case 1:lastPlayingPlayer=Player.PLAYER_1;break;
              case 2:lastPlayingPlayer=Player.PLAYER_2;break;
              case 3:lastPlayingPlayer=Player.PLAYER_3;break;
              case 4:lastPlayingPlayer=Player.PLAYER_4;break;
              default:lastPlayingPlayer = Player.PLAYER_2;
            }
            currentState = nextGameState(lastPlayingPlayer,playersNumber);
          }

          console.log(serialBoard)
          resolve({
            mapName,
            playersNumber,
            currentPlayer,
            side,
            serialBoard,
            currentState
          })
        }else{
          reject()
        }
      })
    }))

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
  sendMessage(message:string,player:Player){
    this.socket.emit('send-msg',this.roomID,message,player);
  }
  emitMove(player:Player,cell:Cell):Promise<boolean>{
    return new Promise(((resolve, reject) => {
      let playerNumber = 1;
      switch(player){
        case Player.PLAYER_1:playerNumber = 1;break;
        case Player.PLAYER_2:playerNumber = 2;break;
        case Player.PLAYER_3:playerNumber = 3;break;
        case Player.PLAYER_4:playerNumber = 4;break;
      }
      if(this.roomID)
        this.socket.emit('move',this.roomID,playerNumber,cell.x,cell.y,()=>{
          console.log("callback")
          resolve(true);
        })
    }))

  }
  sendSerialBoard(serialBoard:string,lastPlayed:number){
    this.socket.emit('synchronize-board',this.roomID,serialBoard,lastPlayed)
  }
  persistSession(){
    localStorage.setItem("clonium-session",JSON.stringify({socketID:this.socket.id,roomID:this.roomID}))
  }
  removeSession(){
    localStorage.removeItem("clonium-session")
  }
  getStoredSession():boolean{
    return localStorage.getItem("clonium-session")!=undefined
  }
}
