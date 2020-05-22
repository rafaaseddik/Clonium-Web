import {Injectable} from '@angular/core';
import {Board, MapTemplateName} from 'src/app/shared/models/board.model';
import {RectangularAndSquaresLayout, RectangularLayout, TwoRectangulesLayout} from '../../shared/utils/board-layouts';
import {Cell} from '../../shared/models/cell.model';
import {Player} from '../../shared/models/player.model';
import {playerToNumber} from '../../shared/utils/utilFunctions';
import {GameState} from '../../shared/models/game-state.model';

/**
 * @description
 * This service is used to initialise the game and create the boards.
 *
 * @author
 * Rafaa Seddik
 */
@Injectable({
  providedIn: 'root'
})
export class GameService {


  // Stores the current board, used as a medium between this service and the board.component
  currentBoard: Board;
  // Stores the current player number, used as a medium between this service and the board.component
  curentPlayer: Player;

  constructor() {
  }

  /**
   * @description
   * Provided the board parameters, this method creates the Board object and saves it in the 'currentBoard' attribute
   *
   * @author
   * Rafaa Seddik
   *
   *
   * @param mapName
   * The map template name, the game currently supports 3 templates : rect1, rect2, rect3
   * @param playersNumber
   * The number of player in the board, the game supports from 2 up to 4 players
   * @param side
   * The game is a square matrix, side is the matrix dimension (example : if side=3 => the board is a 3x3 matrix)
   * @param empty
   * Used to configure if the board should be initialised with the players cells
   *    if(empty)   : no players cells initialisation
   *    if(!empty)  : initialise the board with the players cells
   */
  createBoard(mapName: MapTemplateName, playersNumber: number, side: number = 8, empty: boolean = false) {

    /**
     * The result board
     */
    let newBoard: Board;

    /**
     * OFFSETS :
     * The game is a square matrix,
     * offsetMin is the TOP and LEFT padding where putting the players cells
     * offsetMax is the BOTTOM and RIGHT position where putting the players cells
     */
    let offsetMin = 1;
    let offsetMax = 6;
    switch (side) {
      case 6 :
        offsetMin = 1;
        offsetMax = 4;
        break;
      case 8 :
        offsetMin = 1;
        offsetMax = 6;
        break;
      case 10 :
        offsetMin = mapName == 'rect3' ? 1 : 2;
        offsetMax = mapName == 'rect3' ? 8 : 7;
        break;
      case 12 :
        offsetMin = mapName == 'rect3' ? 1 : 2;
        offsetMax = mapName == 'rect3' ? 10 : 9;
        break;
    }

    /**
     * This part is used to initialise the board object with the corresponding mapName, side and number of players
     */
    switch (mapName) {
      case 'rect1': {
        newBoard = new Board(side, side, RectangularLayout(side, side), playersNumber);break;
      }
      case 'rect2': {
        newBoard = new Board(side, side, TwoRectangulesLayout(side, side, 2, 2), playersNumber);break;
      }
      case 'rect3': {
        newBoard = new Board(side, side, RectangularAndSquaresLayout(side, side, side > 8 ? 2 : 1), playersNumber);break;
      }
      default:
        throw new Error('Map Name Undefined');
    }

    /**
     * if the board is to be initalised as not empty, put the players cells in their corresponding position
     */
    if (!empty) {
      newBoard.setCell(offsetMin, offsetMin, new Cell(offsetMin, offsetMin, Player.PLAYER_1, 3));
      newBoard.setCell(offsetMax, offsetMax, new Cell(offsetMax, offsetMax, Player.PLAYER_2, 3));
      if (playersNumber > 2) {
        newBoard.setCell(offsetMax, offsetMin, new Cell(offsetMax, offsetMin, Player.PLAYER_3, 3));
      }
      if (playersNumber > 3) {
        newBoard.setCell(offsetMin, offsetMax, new Cell(offsetMin, offsetMax, Player.PLAYER_4, 3));
      }
    }

    /**
     * Set the current board parameter
     */
    this.currentBoard = newBoard;
  }

  /**
   * @description
   * Used to configure this service for a newly created online board
   *
   * @author
   * Rafaa Seddik
   *
   * @param mapName
   * The map template name, the game currently supports 3 templates : rect1, rect2, rect3
   * @param playersNumber
   * The number of player in the board, the game supports from 2 up to 4 players
   * @param side
   * The game is a square matrix, side is the matrix dimension (example : if side=3 => the board is a 3x3 matrix)
   *
   */
  createOnlineBoard(mapName: MapTemplateName, playersNumber: number, side: number) {
    this.curentPlayer = Player.PLAYER_1;
    this.createBoard(mapName, playersNumber, side);
    this.currentBoard.presentPlayers = 1;
  }

  /**
   * @description
   * Used to configure this service to join an already created board
   * Either by joining for the first time
   * Or to rejoin a game that the current used has disconnected from.
   *
   * @author
   * Rafaa Seddik
   *
   * @param mapName
   * * The map template name, the game currently supports 3 templates : rect1, rect2, rect3
   * @param playersNumber
   * The number of player in the board, the game supports from 2 up to 4 players
   * @param currentPlayer
   * The current player number
   * @param side
   * The game is a square matrix, side is the matrix dimension (example : if side=3 => the board is a 3x3 matrix)
   * @param serialBoard (optional: only used when rejoining an old game)
   * When rejoining an old game, this parameter contains a serialized version for the board state (the players' cells positions)
   * @param gameState (optional: only used when rejoining an old game)
   * When rejoining an old game, this parameter contains the current game state (who's turn is it)
   */
  joinOnlineBoard(mapName: MapTemplateName, playersNumber: number, currentPlayer: Player, side: number, serialBoard:string="", gameState:GameState=null) {
    this.curentPlayer = currentPlayer;


    if(serialBoard.length>0) {
      /**
       * The code is accessed when rejoining a room
       */
      this.createBoard(mapName,playersNumber,side,true);
      this.currentBoard.deserialize(serialBoard);
      this.currentBoard.currentState = gameState;
    }else{
      /**
       * The code is accessed when joining a room for the first time
       */
      this.createBoard(mapName, playersNumber, side);
    }
    // TODO : Check this line of code position
    this.currentBoard.presentPlayers = playerToNumber(currentPlayer);
  }
}
