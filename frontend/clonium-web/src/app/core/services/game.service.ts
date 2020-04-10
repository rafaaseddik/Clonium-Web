import {Injectable} from '@angular/core';
import {Board} from 'src/app/shared/models/board.model';
import {RectangularLayout} from '../../shared/config/board-layouts';
import {Cell} from '../../shared/models/cell.model';
import {Player} from '../../shared/models/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {


  currentBoard: Board;

  constructor() {
    this.currentBoard = new Board(8, 8, RectangularLayout(8, 8));
    this.currentBoard.setCell(1, 1, new Cell(2, 2, Player.PLAYER_1, 1));
    this.currentBoard.setCell(6, 6, new Cell(7, 7, Player.PLAYER_2, 1));
  }

  createBoard(mapName: string) {
    let newBoard: Board;
    switch (mapName) {
      case 'rect1': {
        newBoard = new Board(8, 8, RectangularLayout(8, 8));
        newBoard.setCell(2, 2, new Cell(2, 2, Player.PLAYER_1, 1));
        newBoard.setCell(7, 7, new Cell(7, 7, Player.PLAYER_1, 1));
        break;
      }
      default:
        throw new Error('Map Name Undefined');
    }
    this.currentBoard = newBoard;
  }
}
