import {Cell} from './cell.model';
import {MAX_HEIGHT, MAX_WIDTH} from '../config/board-layouts';

export class Board {
  width;
  height;
  playableCells: boolean[][];
  playedCells: Cell[][];

  offset_x: number;
  offset_y: number;

  constructor(width: number, height: number, playableCells: boolean[][]) {
    this.width = width;
    this.height = height;
    this.playableCells = playableCells;
    this.playedCells = this.playableCells.map((row, y) => row.map((cell, x) => cell ? Cell.EmptyCell(x, y) : Cell.UnplayableCell(x, y)));

    this.offset_x = Math.floor((MAX_WIDTH - width) / 2);
    this.offset_y = Math.floor((MAX_HEIGHT - height) / 2);
  }

  getCell(x: number, y: number): Cell {
    return this.playedCells[y + this.offset_y][x + this.offset_x];
  }

  setCell(x: number, y: number, cell: Cell): void {
    this.playedCells[y + this.offset_y][x + this.offset_x] = cell;
  }


}



