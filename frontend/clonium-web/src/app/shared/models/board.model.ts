import {Cell} from './cell.model';
import {GameState} from './game-state.model';
import {Player} from './player.model';
import * as _ from 'lodash';

export type MapTemplateName = 'rect1' | 'rect2' | 'rect3';

/**
 * @description
 * Stores the board data and implements the game-play algorithms
 * @author
 * Rafaa Seddik
 */
export class Board {
  // The board dimensions
  width;
  height;
  // If 1: playable, 0 unplayable
  playableCells: boolean[][];
  // Each cell state (if is associated to a player, empty, not playable)
  playedCells: Cell[][];
  // The number of players
  playersNumber:number;
  // The number of connected player (used in an online game)
  presentPlayers:number;
  // Stores the the players who reachs 0 as score
  lostPlayers : Set<GameState> = new Set<GameState>();
  // Stores the current game state
  currentState: GameState;

  // TODO : remove offset_x and offset_y from this class
  // tslint:disable-next-line:variable-name
  /** @deprecated */offset_x: number;
  // tslint:disable-next-line:variable-name
  /** @deprecated */offset_y: number;

  constructor(width: number, height: number, playableCells: boolean[][],playersNumber:number=2) {
    this.width = width;
    this.height = height;
    this.playableCells = playableCells;

    // initialise playedCells from playableCells Matrix
    this.playedCells = this.playableCells.map((row, y) => row.map((cell, x) => cell ? Cell.EmptyCell(x, y) : Cell.UnplayableCell(x, y)));

    this.playersNumber=playersNumber;
    this.presentPlayers = 1;
    this.currentState = GameState.PLAYER_1;
  }

  /**
   * @description
   * Gets a cells by its coordinates
   *
   * @author
   * Rafaa Seddik
   *
   * @param x
   * @param y
   */
  getCell(x: number, y: number): Cell {
    return this.playedCells[y][x];
  }

  /**
   * @description
   * Gets the neighboring cells
   * the cell in top, bottom, left, and right (if they exist)
   *
   * @author
   * Rafaa Seddik
   *
   * @param cell
   */
  getCellNeighbors(cell:Cell): Array<Cell> {
    const x = cell.x;
    const y = cell.y;
    const result = [];
    if (x - 1 >= 0 && this.playableCells[y][x - 1]) {
      result.push(this.playedCells[y][x - 1]);
    }
    if (y - 1 >= 0 && this.playableCells[y - 1][x]) {
      result.push(this.playedCells[y - 1][x]);
    }
    if (x + 1 < this.width && this.playableCells[y][x + 1]) {
      result.push(this.playedCells[y][x + 1]);
    }
    if (y + 1 < this.height && this.playableCells[y + 1][x]) {
      result.push(this.playedCells[y + 1][x]);
    }
    return result;

  }


  /**
   * @description
   * Returns if the given coordinates are of a valid playable cell
   *
   * @author
   * Rafaa Seddik
   *
   * @param x
   * @param y
   */
  canPlay(x, y) {
    return (x >= 0 && y >= 0 && x < this.width && y < this.height && this.playableCells[y][x]);
  }

  /**
   * @description
   * Sets a playable cell new Cell.model object
   *
   * @author
   * Rafaa Seddik
   *
   * @param x
   * @param y
   * @param cell
   */
  setCell(x: number, y: number, cell: Cell): void {
    this.playedCells[y][x] = cell;
  }


  /**
   * @description
   * Serializes the playableCells Array to string
   * @author
   * Rafaa Seddik
   */
  serialize():string{
    return JSON.stringify((_.flatten(this.playedCells) as Array<Cell>)
      .filter(cell => cell.player === Player.PLAYER_1 || cell.player === Player.PLAYER_2 || cell.player === Player.PLAYER_3|| cell.player === Player.PLAYER_4));
  }

  /**
   * @description
   * Deserialize the playableCells from a string
   *
   * @author
   * Rafaa Seddik
   *
   * @param serialBoard
   */
  deserialize(serialBoard:string){
    let rawCellsObject = JSON.parse(serialBoard);
    rawCellsObject.forEach(rawCell=>{
      this.setCell(rawCell.x,rawCell.y, new Cell(rawCell.x,rawCell.y,rawCell.player,rawCell.value))
    });
  }

}



