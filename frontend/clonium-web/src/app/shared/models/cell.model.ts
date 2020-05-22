import {Player} from './player.model';

/**
 * @description
 * Contains a cell details
 * @author
 * Rafaa Seddik
 *
 */
export class Cell {

  // Cell coordinates
  x: number;
  y: number;
  // The cell owner
  player: Player = Player.NO_PLAYER;
  // The cell value [0-4]
  value: number;

  constructor(x: number, y: number, player: Player = Player.NO_PLAYER, value: number = 0) {
    this.x = x;
    this.y = y;
    this.player = player;
    this.value = value;
  }

  /**
   * @description
   * Increments the value of a cell, and changes the owner
   * @author
   * Rafaa Seddik
   *
   * @param newPlayer
   */
  increment(newPlayer: Player) {
    this.value = this.value + 1;
    if(this.value>4){
      this.value=4;
    }
    this.player = newPlayer;
  }

  /**
   * @description
   * When a cell explodes, its value return to 0, and its owner is NO_PLAYER
   * @author
   * Rafaa Seddik
   *
   */
  explode() {
    this.value = 0;
    this.player = Player.NO_PLAYER;
  }

  /**
   * @description
   * Stringify the player number, to be used as a CSS class
   * @author
   * Rafaa Seddik
   *
   */
  getPlayer(): string {
    switch (this.player) {
      case Player.NO_PLAYER:
        return 'empty';
      case Player.UNPLAYABLE:
        return 'locked';
      case Player.PLAYER_1:
        return 'player1 value-' + this.value;
      case Player.PLAYER_2:
        return 'player2 value-' + this.value;
      case Player.PLAYER_3:
        return 'player3 value-' + this.value;
      case Player.PLAYER_4:
        return 'player4 value-' + this.value;
    }
  }

  /**
   * @description
   * A standard playable Cell that cen be owned by a player
   * @author
   * Rafaa Seddik
   *
   * @param x
   * @param y
   * @constructor
   */
  static EmptyCell(x: number, y: number): Cell {
    return new Cell(x, y);
  }

  /**
   * @description
   * An standard unplayable Cell
   * @author
   * Rafaa Seddik
   *
   * @param x
   * @param y
   * @constructor
   */
  static UnplayableCell(x: number, y: number): Cell {
    return new Cell(x, y, Player.UNPLAYABLE);
  }


}

