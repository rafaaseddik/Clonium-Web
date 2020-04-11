import {Component, Input, OnInit} from '@angular/core';
import {Board} from '../../models/board.model';
import {Cell} from '../../models/cell.model';
import {GameState} from '../../models/game-state.model';
import {Player} from '../../models/player.model';

import * as _ from 'lodash';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit {

  @Input() board: Board;

  GameState = GameState;
  Player = Player;

  constructor() {
  }

  ngOnInit() {
  }

  // returns true if something changed
  analyse(): Array<Cell> {
    this.board.currentState = GameState.ANALYSING;
    const cells = (_.flatten(this.board.playedCells) as Array<Cell>)
      .filter(cell => cell.player === Player.PLAYER_1 || cell.player === Player.PLAYER_2)
      .filter(cell => cell.value === 4);

    return cells;
  }

  async update(cells: Array<Cell>, player: Player) {
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
      this.board.currentState = GameState.PLAYER_2;
    } else if (this.board.currentState === GameState.PLAYER_2) {
      let explosionCells = this.analyse();
      while (explosionCells.length > 0) {
        await this.update(explosionCells, Player.PLAYER_2);
        explosionCells = this.analyse();
      }
      this.board.currentState = GameState.PLAYER_1;
    }
  }

  increment(cell: Cell) {
    if (this.board.currentState === GameState.PLAYER_1 && cell.player === Player.PLAYER_1) {
      cell.increment(Player.PLAYER_1);
      this.nextRole();
    } else if (this.board.currentState === GameState.PLAYER_2 && cell.player === Player.PLAYER_2) {
      cell.increment(Player.PLAYER_2);
      this.nextRole();
    }

  }
}
