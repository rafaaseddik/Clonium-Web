import {Player} from '../models/player.model';
import {GameState} from '../models/game-state.model';

/**
 * @description
 * Converts a Player.enum value to a GameState.enum value
 * @author
 * Rafaa Seddik
 *
 * @param player
 */
export function playerToGameState(player: Player): GameState {
  let currentState: GameState;
  switch (player) {
    case Player.PLAYER_1:
      currentState = GameState.PLAYER_1;
      break;
    case Player.PLAYER_2:
      currentState = GameState.PLAYER_2;
      break;
    case Player.PLAYER_3:
      currentState = GameState.PLAYER_3;
      break;
    case Player.PLAYER_4:
      currentState = GameState.PLAYER_4;
      break;
    default:
      currentState = GameState.UNDEFINED;
  }
  return currentState;
}

/**
 * @description
 * Converts a Player.enum value to a number
 * @author
 * Rafaa Seddik
 *
 * @param player
 */
export function playerToNumber(player:Player){
  switch (player) {
    case Player.PLAYER_1:
      return 1;
    case Player.PLAYER_2:
      return 2;
    case Player.PLAYER_3:
      return 3;
    case Player.PLAYER_4:
      return 4;
    default:
      throw Error("Player UNKNOWN " + player)
  }
}

/**
 * @description
 * Returns the next gameState from the previous Player_X game state
 *
 * @author
 * Rafaa Seddik
 *
 * @param player
 * @param playersNumber
 */
export function nextGameState(player: Player, playersNumber: number): GameState {
  switch (player) {
    case Player.PLAYER_1:
      return GameState.PLAYER_2;
    case Player.PLAYER_2: {
      if (playersNumber > 2) {
        return GameState.PLAYER_3;
      } else {
        return GameState.PLAYER_1;
      }
    }
    case Player.PLAYER_3: {
      if (playersNumber > 3) {
        return GameState.PLAYER_4;
      } else {
        return GameState.PLAYER_1;
      }
    }
    case Player.PLAYER_4:
      return GameState.PLAYER_1;
  }
}
