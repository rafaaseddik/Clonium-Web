import {Player} from './player.model';

export class Cell {

  x: number;
  y: number;
  player: Player;
  value: number;

  constructor(x: number, y: number, player: Player = Player.NO_PLAYER, value: number = 0) {
    this.x = x;
    this.y = y;
    this.player = player;
    this.value = value;
  }

  increment(newPlayer: Player) {
    this.value = this.value + 1;
    this.player = newPlayer;
  }

  explode() {
    this.value = 0;
    this.player = Player.NO_PLAYER;
  }

  getPlayer(): string {
    switch (this.player) {
      case Player.NO_PLAYER:
        return 'empty';
        break;
      case Player.UNPLAYABLE:
        return 'locked';
        break;
      case Player.PLAYER_1:
        return 'player1 value-' + this.value;
        break;
      case Player.PLAYER_2:
        return 'player2 value-' + this.value;
        break;
      case Player.PLAYER_3:
        return 'player3 value-' + this.value;
        break;
      case Player.PLAYER_4:
        return 'player4 value-' + this.value;
        break;
    }
  }

  static EmptyCell(x: number, y: number): Cell {
    return new Cell(x, y);
  }

  static UnplayableCell(x: number, y: number): Cell {
    return new Cell(x, y, Player.UNPLAYABLE);
  }


}

