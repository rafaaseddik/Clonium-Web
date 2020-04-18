import {Component, Input, OnInit} from '@angular/core';
import {Board} from '../../models/board.model';
import {Cell} from '../../models/cell.model';
import {GameState} from '../../models/game-state.model';
import {Player} from '../../models/player.model';

import * as _ from 'lodash';
import {wait} from '../../utils/time-management';
import {GameService} from '../../../core/services/game.service';
import {RoomService} from '../../../core/services/room.service';
import {nextGameState, playerToGameState} from '../../utils/utilFunctions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit {

  @Input() isOnline: boolean = false;
  noPlayer2: boolean = true;
  noPlayer3: boolean = true;
  noPlayer4: boolean = true;
  currentPlayer: Player;
  roomID:string;
  @Input() board: Board;
  playerToGameState = playerToGameState;
  GameState = GameState;
  Player = Player;

  player1Score = 0;
  player2Score = 0;
  player3Score = 0;
  player4Score = 0;

  constructor(private gameService: GameService, private roomService: RoomService) {
  }

  ngOnInit() {
    this.updateScore();
    if (this.isOnline) {
      this.currentPlayer = this.gameService.curentPlayer;
      this.roomID = this.roomService.roomID;
      this.updateConnectedPlayersNumber()
      this.roomService.playerTwoJoined.asObservable().subscribe(joined => {
        this.noPlayer2 = false;
        this.board.presentPlayers ++ ;
      });
      this.roomService.playerThreeJoined.asObservable().subscribe(joined => {
        this.noPlayer3 = false;
        this.board.presentPlayers ++ ;
      });
      this.roomService.playerFourJoined.asObservable().subscribe(joined => {
        this.noPlayer4 = false;
        this.board.presentPlayers ++ ;
      });
      this.roomService.move.asObservable().subscribe(move=>{
        let movePlayer:Player;
        switch(move.player){
          case 1:movePlayer=Player.PLAYER_1;break;
          case 2:movePlayer=Player.PLAYER_2;break;
          case 3:movePlayer=Player.PLAYER_3;break;
          case 4:movePlayer=Player.PLAYER_4;break;
          default:movePlayer = Player.PLAYER_2;
        }
        if(movePlayer!= this.currentPlayer){
          this.incrementFromOtherPlayer(move.x,move.y,movePlayer);
        }
      })
    }

  }

  updateConnectedPlayersNumber(){
    this.roomService.getConnectedPlayers(this.roomID).then(nb=>{
      if(nb<this.board.presentPlayers){
        this.board.presentPlayers = nb;
      }
      if(this.board.presentPlayers<this.board.playersNumber){
        setTimeout(()=>this.updateConnectedPlayersNumber(),1000);
      }
    });
  }
  copyToClipboard(event){
    let input = event.target;
    input.select()
    document.execCommand('copy');
  }

  // returns true if something changed
  analyse(): Array<Cell> {
    this.board.currentState = GameState.ANALYSING;
    const cells = (_.flatten(this.board.playedCells) as Array<Cell>)
      .filter(cell => cell.player === Player.PLAYER_1 || cell.player === Player.PLAYER_2 || cell.player === Player.PLAYER_3|| cell.player === Player.PLAYER_4)
      .filter(cell => cell.value === 4);

    return cells;
  }

  async update(cells: Array<Cell>, player: Player) {
    await wait(500);
    this.board.currentState = GameState.UPDATING;
    cells.forEach(cell => {
      cell.explode();
      this.board.getCellNeighbors(cell).forEach(neighborCell => neighborCell.increment(player));
    });
  }

  async nextRole() {
    if (this.board.currentState === GameState.PLAYER_1) {
      let explosionCells = this.analyse();
      while (explosionCells.length > 0) {
        await this.update(explosionCells, Player.PLAYER_1);
        explosionCells = this.analyse();
      }
      this.board.currentState = nextGameState(Player.PLAYER_1,this.board.playersNumber);
    } else if (this.board.currentState === GameState.PLAYER_2) {
      let explosionCells = this.analyse();
      while (explosionCells.length > 0) {
        await this.update(explosionCells, Player.PLAYER_2);
        explosionCells = this.analyse();
      }
      this.board.currentState = nextGameState(Player.PLAYER_2,this.board.playersNumber);
    }
    else if (this.board.currentState === GameState.PLAYER_3) {
      let explosionCells = this.analyse();
      while (explosionCells.length > 0) {
        await this.update(explosionCells, Player.PLAYER_3);
        explosionCells = this.analyse();
      }
      this.board.currentState = nextGameState(Player.PLAYER_3,this.board.playersNumber);
    }
    else if (this.board.currentState === GameState.PLAYER_4) {
      let explosionCells = this.analyse();
      while (explosionCells.length > 0) {
        await this.update(explosionCells, Player.PLAYER_4);
        explosionCells = this.analyse();
      }
      this.board.currentState = nextGameState(Player.PLAYER_4,this.board.playersNumber);
    }
    this.updateScore();
  }

  async increment(cell: Cell) {
    if (this.board.currentState === GameState.PLAYER_1 && cell.player === Player.PLAYER_1 && (!this.isOnline || this.currentPlayer == Player.PLAYER_1)) {
      this.roomService.emitMove(this.currentPlayer, cell);
      cell.increment(Player.PLAYER_1);
      this.nextRole();
    } else if (this.board.currentState === GameState.PLAYER_2 && cell.player === Player.PLAYER_2 && (!this.isOnline || this.currentPlayer == Player.PLAYER_2)) {
      this.roomService.emitMove(this.currentPlayer, cell);
      cell.increment(Player.PLAYER_2);
      this.nextRole();
    }
    else if (this.board.currentState === GameState.PLAYER_3 && cell.player === Player.PLAYER_3 && (!this.isOnline || this.currentPlayer == Player.PLAYER_3)) {
      this.roomService.emitMove(this.currentPlayer, cell);
      cell.increment(Player.PLAYER_3);
      this.nextRole();
    }
    else if (this.board.currentState === GameState.PLAYER_4 && cell.player === Player.PLAYER_4 && (!this.isOnline || this.currentPlayer == Player.PLAYER_4)) {
      this.roomService.emitMove(this.currentPlayer, cell);
      cell.increment(Player.PLAYER_4);
      this.nextRole();
    }

  }

  async incrementFromOtherPlayer(x:number,y:number,player:Player) {
    let moveState = playerToGameState(player);
    if (this.board.currentState === moveState &&  this.currentPlayer != player) {
      this.board.playedCells[y][x].increment(player);
      this.nextRole();
    }

  }

  updateScore() {
    this.player1Score = (_.flatten(this.board.playedCells) as Array<Cell>).filter(cell => cell.player === Player.PLAYER_1).length;
    this.player2Score = (_.flatten(this.board.playedCells) as Array<Cell>).filter(cell => cell.player === Player.PLAYER_2).length;
    if(this.board.playersNumber>=3)
      this.player3Score = (_.flatten(this.board.playedCells) as Array<Cell>).filter(cell => cell.player === Player.PLAYER_3).length;
    if(this.board.playersNumber==4)
      this.player4Score = (_.flatten(this.board.playedCells) as Array<Cell>).filter(cell => cell.player === Player.PLAYER_4).length;

    if (this.player1Score === 0 && !this.board.lostPlayers.includes(Player.PLAYER_1)) {
      this.board.lostPlayers.push(Player.PLAYER_1)
    }
    if (this.player2Score === 0 && !this.board.lostPlayers.includes(Player.PLAYER_2)) {
      this.board.lostPlayers.push(Player.PLAYER_2)
    }
    if (this.player3Score === 0 && !this.board.lostPlayers.includes(Player.PLAYER_3)) {
      this.board.lostPlayers.push(Player.PLAYER_3)
    }
    if (this.player4Score === 0 && !this.board.lostPlayers.includes(Player.PLAYER_4)) {
      this.board.lostPlayers.push(Player.PLAYER_4)
    }
    if(this.board.lostPlayers.length==this.board.playersNumber-1){
      if(!this.board.lostPlayers.includes(Player.PLAYER_1)){
        this.board.currentState = GameState.PLAYER_1_WON
      }
      if(!this.board.lostPlayers.includes(Player.PLAYER_2)){
        this.board.currentState = GameState.PLAYER_2_WON
      }
      if(!this.board.lostPlayers.includes(Player.PLAYER_3)){
        this.board.currentState = GameState.PLAYER_3_WON
      }
      if(!this.board.lostPlayers.includes(Player.PLAYER_4)){
        this.board.currentState = GameState.PLAYER_4_WON
      }
    }
  }
}
