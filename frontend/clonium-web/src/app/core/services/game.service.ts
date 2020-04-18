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

  createBoard(mapName: string,playersNumber:number) {
    let newBoard: Board;
    switch (mapName) {
      case 'rect1': {
        newBoard = new Board(8, 8, RectangularLayout(8, 8),playersNumber);
        newBoard.setCell(1, 1, new Cell(1, 1, Player.PLAYER_1, 1));
        newBoard.setCell(6, 6, new Cell(6, 6, Player.PLAYER_2, 1));
        if(playersNumber>2){
          newBoard.setCell(6, 1, new Cell(6, 1, Player.PLAYER_3, 1));
        }
        if(playersNumber>3){
          newBoard.setCell(1, 6, new Cell(1, 6, Player.PLAYER_4, 1));
        }
        break;
      }
      case 'rect2': {
        newBoard = new Board(8, 8, TwoRectangulesLayout(8, 8,2,2),playersNumber);
        newBoard.setCell(1, 1, new Cell(1, 1, Player.PLAYER_1, 1));
        newBoard.setCell(6, 6, new Cell(6, 6, Player.PLAYER_2, 1));
        if(playersNumber>2){
          newBoard.setCell(6, 1, new Cell(6, 1, Player.PLAYER_3, 1));
        }
        if(playersNumber>3){
          newBoard.setCell(1, 6, new Cell(1, 6, Player.PLAYER_4, 1));
        }
        break;
      }
      case 'rect3':{
        newBoard = new Board(8, 8, RectangularAndSquaresLayout(8, 8,1),playersNumber);
        newBoard.setCell(1, 1, new Cell(1, 1, Player.PLAYER_1, 1));
        newBoard.setCell(6, 6, new Cell(6, 6, Player.PLAYER_2, 1));
        if(playersNumber>2){
          newBoard.setCell(6, 1, new Cell(6, 1, Player.PLAYER_3, 1));
        }
        if(playersNumber>3){
          newBoard.setCell(1, 6, new Cell(1, 6, Player.PLAYER_4, 1));
        }
        break;
      }
      default:
        throw new Error('Map Name Undefined');
    }
    this.currentBoard = newBoard;
  }

  createOnlineBoard(mapName:string,playersNumber:number){
    this.curentPlayer = Player.PLAYER_1;
    this.createBoard(mapName,playersNumber);
    this.currentBoard.presentPlayers = 1;
  }
  joinOnlineBoard(mapName:string,playersNumber:number,currentPlayer:Player){
    this.curentPlayer = currentPlayer;
    this.createBoard(mapName,playersNumber);
    this.currentBoard.presentPlayers = playerToNumber(currentPlayer);
  }
}
