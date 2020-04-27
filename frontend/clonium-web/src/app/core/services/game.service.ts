import {Injectable} from '@angular/core';
import {Board} from 'src/app/shared/models/board.model';
import {RectangularAndSquaresLayout, RectangularLayout, TwoRectangulesLayout} from '../../shared/utils/board-layouts';
import {Cell} from '../../shared/models/cell.model';
import {Player} from '../../shared/models/player.model';
import {playerToNumber} from '../../shared/utils/utilFunctions';

@Injectable({
  providedIn: 'root'
})
export class GameService {


  currentBoard: Board;
  curentPlayer:Player;
  constructor() {
  }

  createBoard(mapName: string,playersNumber:number,side:number=8) {
    let newBoard: Board;
    let offsetMin = 1;
    let offsetMax = 6;
    switch(side){
      case 6 : offsetMin = 1;offsetMax=4;break;
      case 8 : offsetMin = 1;offsetMax=6;break;
      case 10 :offsetMin = 2;offsetMax=7;break;
      case 12 :offsetMin = 3;offsetMax=8;break;
    }
    switch (mapName) {
      case 'rect1': {
        newBoard = new Board(side, side, RectangularLayout(side, side),playersNumber);
        newBoard.setCell(offsetMin, offsetMin, new Cell(offsetMin, offsetMin, Player.PLAYER_1, 3));
        newBoard.setCell(offsetMax, offsetMax, new Cell(offsetMax, offsetMax, Player.PLAYER_2, 3));
        if(playersNumber>2){
          newBoard.setCell(offsetMax, offsetMin, new Cell(offsetMax, offsetMin, Player.PLAYER_3, 3));
        }
        if(playersNumber>3){
          newBoard.setCell(offsetMin, offsetMax, new Cell(offsetMin, offsetMax, Player.PLAYER_4, 3));
        }
        break;
      }
      case 'rect2': {
        newBoard = new Board(side, side, TwoRectangulesLayout(side, side,2,2),playersNumber);
        newBoard.setCell(offsetMin, offsetMin, new Cell(offsetMin, offsetMin, Player.PLAYER_1, 3));
        newBoard.setCell(offsetMax, offsetMax, new Cell(offsetMax, offsetMax, Player.PLAYER_2, 3));
        if(playersNumber>2){
          newBoard.setCell(offsetMax, offsetMin, new Cell(offsetMax, offsetMin, Player.PLAYER_3, 3));
        }
        if(playersNumber>3){
          newBoard.setCell(offsetMin, offsetMax, new Cell(offsetMin, offsetMax, Player.PLAYER_4, 3));
        }
        break;
      }
      case 'rect3':{
        newBoard = new Board(side, side, RectangularAndSquaresLayout(side, side,offsetMin),playersNumber);
        newBoard.setCell(offsetMin, offsetMin, new Cell(offsetMin, offsetMin, Player.PLAYER_1, 3));
        newBoard.setCell(offsetMax, offsetMax, new Cell(offsetMax, offsetMax, Player.PLAYER_2, 3));
        if(playersNumber>2){
          newBoard.setCell(offsetMax, offsetMin, new Cell(offsetMax, offsetMin, Player.PLAYER_3, 3));
        }
        if(playersNumber>3){
          newBoard.setCell(offsetMin, offsetMax, new Cell(offsetMin, offsetMax, Player.PLAYER_4, 3));
        }
        break;
      }
      default:
        throw new Error('Map Name Undefined');
    }
    this.currentBoard = newBoard;
  }

  createOnlineBoard(mapName:string,playersNumber:number,side:number){
    this.curentPlayer = Player.PLAYER_1;
    this.createBoard(mapName,playersNumber,side);
    this.currentBoard.presentPlayers = 1;
  }
  joinOnlineBoard(mapName:string,playersNumber:number,currentPlayer:Player,side:number){
    this.curentPlayer = currentPlayer;
    this.createBoard(mapName,playersNumber,side);
    this.currentBoard.presentPlayers = playerToNumber(currentPlayer);
  }
}
