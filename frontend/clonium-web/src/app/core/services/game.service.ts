import {Injectable} from '@angular/core';
import {Board} from 'src/app/shared/models/board.model';
import {RectangularAndSquaresLayout, RectangularLayout, TwoRectangulesLayout} from '../../shared/utils/board-layouts';
import {Cell} from '../../shared/models/cell.model';
import {Player} from '../../shared/models/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {


  currentBoard: Board;
  curentPlayer:Player;
  constructor() {
  }

  createBoard(mapName: string) {
    let newBoard: Board;
    switch (mapName) {
      case 'rect1': {
        newBoard = new Board(8, 8, RectangularLayout(8, 8));
        newBoard.setCell(1, 1, new Cell(1, 1, Player.PLAYER_1, 1));
        newBoard.setCell(6, 6, new Cell(6, 6, Player.PLAYER_2, 1));
        break;
      }
      case 'rect2': {
        newBoard = new Board(8, 8, TwoRectangulesLayout(8, 8,2,2));
        newBoard.setCell(1, 1, new Cell(1, 1, Player.PLAYER_1, 1));
        newBoard.setCell(6, 6, new Cell(6, 6, Player.PLAYER_2, 1));
        break;
      }
      case 'rect3':{
        newBoard = new Board(8, 8, RectangularAndSquaresLayout(8, 8,1));
        newBoard.setCell(1, 1, new Cell(1, 1, Player.PLAYER_1, 1));
        newBoard.setCell(6, 6, new Cell(6, 6, Player.PLAYER_2, 1));
        break;
      }
      default:
        throw new Error('Map Name Undefined');
    }
    this.currentBoard = newBoard;
  }

  createOnlineBoard(mapName:string){
    this.curentPlayer = Player.PLAYER_1;
    this.createBoard(mapName);
  }
  joinOnlineBoard(mapName:string){
    this.curentPlayer = Player.PLAYER_2;
    this.createBoard(mapName);
  }
}
