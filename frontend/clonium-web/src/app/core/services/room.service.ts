import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Board, MapTemplateName} from '../../shared/models/board.model';

import * as io from 'socket.io-client';
import {Player} from '../../shared/models/player.model';
import {Cell} from '../../shared/models/cell.model';
import {Subject} from 'rxjs';
import {Message} from '../../shared/models/message.model';
import {GameState} from '../../shared/models/game-state.model';
import {nextGameState} from '../../shared/utils/utilFunctions';

/**
 * @description
 * This service is responsible for synchronizing and configuring an online game room.
 * Communication with the backend server is done using an HTTP API to create or to join a game for the first time (mainly used to get a roomID)
 * And a socket connection to communicate with the other room's players and to synchronise the game state with the other players.
 *
 * @author
 * Rafaa Seddik
 */
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  /**
   * The socket instance, initialized in this service constructor
   */
  socket;
  /**
   * The current roomID
   */
  roomID: string;
  /**
   * The current player number
   */
  currentPlayerNumber: number = 0;

  /**
   * These RxJS subject are used to notify the board.component if a player has joined/unjoined the current room
   * these subjects
   *    - emit 'true' if the corresponding player joined the room
   *    - emit 'false' if the corresponding player unjoined the room
   */
  playerOneJoined: Subject<boolean> = new Subject<boolean>();
  playerTwoJoined: Subject<boolean> = new Subject<boolean>();
  playerThreeJoined: Subject<boolean> = new Subject<boolean>();
  playerFourJoined: Subject<boolean> = new Subject<boolean>();

  /**
   * This RxJS subject is used to notify the board.component if another player has made a move
   * a move is characterised by :
   *    - the player : who made the mode
   *    - the coordinates of the clicked cell (x,y)
   */
  move: Subject<{ player: Player, x: number, y: number }> = new Subject<{ player: Player, x: number, y: number }>();

  /**
   * This RxJS subject is used to notify the board.component if another player sent a message
   */
  receiveMessage: Subject<Message> = new Subject<Message>();

  /**
   * The socket event handlers are declared in the constructor
   */
  constructor(private http: HttpClient) {
    /**
     * Create the socket connection with the backend server
     */
    this.socket = io(environment.API_URL);

    /**
     * These events are used to handle the players joining/unjoining the current room
     * TODO : Group these events in one unique event
     */
    this.socket.on('first_player_joined', (toggle) => {
      this.playerOneJoined.next(toggle);
    });
    this.socket.on('second_player_joined', (toggle) => {
      this.playerTwoJoined.next(toggle);
    });
    this.socket.on('third_player_joined', (toggle) => {
      this.playerThreeJoined.next(toggle);
    });
    this.socket.on('fourth_player_joined', (toggle) => {
      this.playerFourJoined.next(toggle);
    });

    /**
     * The event is used to be notified when another player has made a move
     */
    this.socket.on('move', (player, x, y) => {
      this.move.next({player, x, y});
    });

    /**
     * When a player joins/unjoins the room, the backend server pings all the players in the room to check who's connected and who's not
     * When a player gets a ping event, it will emit a 'ping-response' event
     */
    this.socket.on('ping', () => {
      this.socket.emit('ping-response', this.roomID, this.currentPlayerNumber);
    });

    /**
     * This is the event handler for when a player send a message in the current room
     */
    this.socket.on('receive-message', (message, player) => {
      this.receiveMessage.next(new Message(player, message));
    });
  }

  /**
   * @description
   * This method is used to contact the backend server to request the creation of a new online room
   * The backend server will respond with the newly created roomID : the room's unique identifier
   *
   * After joining the room, the persistSession() method will be called
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
   * @returns ASYNC
   * The newly created board
   */
  async createRoom(mapName: MapTemplateName, playersNumber: number, side: number): Promise<Board> {
    return new Promise<Board>(((resolve, reject) => {
      let body = {
        mapName: mapName,
        playersNumber: playersNumber,
        side: side
      };
      this.http.post(environment.API_URL + 'room/create', body).subscribe(responseJSON => {
        if (responseJSON['success']) {
          this.roomID = responseJSON['roomID'];
          /**
           * Emit a 'create-room' event with the newly created roomID to subscribe the current socket in the the room Socket Namespace
           */
          this.socket.emit('create-room', this.roomID);
          this.currentPlayerNumber = 1;
          this.persistSession();
          resolve(responseJSON['board'] as Board);
        } else {
          reject();
        }
      }, error => {
        reject(error);
      });
    }));
  }

  /**
   * @description
   * This webservice requests the backend to have access to an online room by its roomID,
   * if there is still an available place in the room, the backend will respond with :
   *    - The Map Template Name : the game currently supports 3 templates : rect1, rect2, rect3
   *    - The Map number of players
   *    - The Map side: The game is a square matrix, side is the matrix dimension (example : if side=3 => the board is a 3x3 matrix)
   *    - The player number given to the current player
   *
   * After joining the room, the persistSession() method will be called
   *
   * @author
   * Rafaa Seddik
   *
   * @param roomID
   * The room id to join

   * @returns ASYNC
   *    - mapName: the game currently supports 3 templates : rect1, rect2, rect3
   *    - playersNumber: The number of player in the board, the game supports from 2 up to 4 players
   *    - currentPlayer: The current player number
   *    - side: The game is a square matrix, side is the matrix dimension (example : if side=3 => the board is a 3x3 matrix)
   *
   */
  async joinRoom(roomID: string): Promise<{ mapName: MapTemplateName, playersNumber: number, currentPlayer: Player, side: number }> {
    return new Promise(((resolve, reject) => {
      const body = {
        roomID: roomID
      };
      this.http.post(environment.API_URL + 'room/join', body).subscribe(responseJSON => {
        if (responseJSON['success']) {
          /**
           * Emit a 'join-room' event with the roomID to subscribe the current socket in the the room Socket Namespace
           */
          this.socket.emit('join-room', roomID, responseJSON['board']['currentPlayerNumber']);
          this.currentPlayerNumber = responseJSON['board']['currentPlayerNumber'];
          this.roomID = roomID;
          this.persistSession();
          let currentPlayer: Player;
          switch (responseJSON['board']['currentPlayerNumber']) {
            case 1:
              currentPlayer = Player.PLAYER_1;
              break;
            case 2:
              currentPlayer = Player.PLAYER_2;
              break;
            case 3:
              currentPlayer = Player.PLAYER_3;
              break;
            case 4:
              currentPlayer = Player.PLAYER_4;
              break;
            default:
              currentPlayer = Player.PLAYER_2;
          }
          resolve(
            {
              mapName: responseJSON['board'].room.board,
              playersNumber: responseJSON['board'].room.playersNumber,
              currentPlayer: currentPlayer,
              side: responseJSON['board'].room.side
            });
        } else {
          reject();
        }

      }, error => {
        reject(error);
      });
    }));
  }

  /**
   * @description
   * This method requests the socket engine to subscribe the current socket in the already persisted roomID namespace to have access the online room
   * The current socket will send only the persisted SocketID
   * if the socket engine verifies if the socketID was really subscribed in the roomID namespace, it will callback with :
   *    - roomIDWS : The roomID where the persisted Socket was subscribed to
   *    - playerNumber : The player number assigned to the socket
   *    - mapName : The Map Template Name (the game currently supports 3 templates : rect1, rect2, rect3)
   *    - playersNumber : The Map number of players
   *    - side : The game is a square matrix, side is the matrix dimension (example : if side=3 => the board is a 3x3 matrix)
   *    - serialBoard : Contains a serialized version for the board state (the players' cells positions)
   *    - lastPlayed : The last player who played
   *
   * After joining the room, the persistSession() method will be called
   *
   * TODO : Synchronize lost players when rejoining the room
   * @author
   * Rafaa Seddik
   *
   * @returns ASYNC
   *    - mapName: the game currently supports 3 templates : rect1, rect2, rect3
   *    - playersNumber: The number of player in the board, the game supports from 2 up to 4 players
   *    - currentPlayer: The current player number
   *    - side: The game is a square matrix, side is the matrix dimension (example : if side=3 => the board is a 3x3 matrix)
   *    - serialBoard: Contains a serialized version for the board state (the players' cells positions)
   *    - currentState: When rejoining an old game, this parameter contains the current game state (who's turn is it)
   *
   */
  rejoinRoom(): Promise<{ mapName: MapTemplateName, playersNumber: number, currentPlayer: Player, side: number, serialBoard: string, currentState: GameState }> {
    return new Promise(((resolve, reject) => {

      /**
       * Get the persisted session
       */
      let {socketID, roomID} = JSON.parse(localStorage.getItem('clonium-session'));
      /**
       * Send the persisted socket ID
       */
      this.socket.emit('rejoin-room', socketID, (roomIDWS, playerNumber, mapName, playersNumber, side, serialBoard, lastPlayed) => {
        /**
         * Verify if the persisted roomID is equal to the roomID sent by the socket engine
         */
        if (roomIDWS == roomID) {
          /**
           * Emit a 'join-room' event with the roomID to subscribe the current socket in the the room Socket Namespace
           */
          this.socket.emit('join-room', roomID, playerNumber);
          this.roomID = roomID;
          this.persistSession();
          let currentPlayer: Player;
          this.currentPlayerNumber = playerNumber;
          /**
           * parse the current player number
           */
          switch (playerNumber) {
            case 1:
              currentPlayer = Player.PLAYER_1;
              break;
            case 2:
              currentPlayer = Player.PLAYER_2;
              break;
            case 3:
              currentPlayer = Player.PLAYER_3;
              break;
            case 4:
              currentPlayer = Player.PLAYER_4;
              break;
            default:
              currentPlayer = Player.PLAYER_2;
          }

          /**
           * Get the current GameState from the lastPlayed value
           */
          let currentState: GameState;
          if (lastPlayed == 0) {
            currentState = GameState.PLAYER_1;
          } else {
            let lastPlayingPlayer: Player;
            switch (lastPlayed) {
              case 1:
                lastPlayingPlayer = Player.PLAYER_1;
                break;
              case 2:
                lastPlayingPlayer = Player.PLAYER_2;
                break;
              case 3:
                lastPlayingPlayer = Player.PLAYER_3;
                break;
              case 4:
                lastPlayingPlayer = Player.PLAYER_4;
                break;
              default:
                lastPlayingPlayer = Player.PLAYER_2;
            }
            currentState = nextGameState(lastPlayingPlayer, playersNumber);
          }
          resolve({
            mapName,
            playersNumber,
            currentPlayer,
            side,
            serialBoard,
            currentState
          });
        } else {
          reject();
        }
      });
    }));

  }


  /**
   * @deprecated
   * TODO : Remove from codebase
   *
   * @description
   * Gets the number of connected players in a room
   *
   * @author
   * Rafaa Seddik
   *
   * @param roomID
   */
  getConnectedPlayers(roomID: string): Promise<number> {
    return new Promise<number>(((resolve, reject) => {
      const body = {
        roomID: roomID
      };
      this.http.post(environment.API_URL + 'room/getConnectedPlayers', body).subscribe(responseJSON => {
        resolve(responseJSON['result']);
      }, error => {
        reject();
      });
    }));
  }

  /**
   * @description
   * Send a message to the room
   *
   * @author
   * Rafaa Seddik
   *
   * @param message
   * The message content
   * @param player
   * The sender player number
   */
  sendMessage(message: string, player: Player) {
    this.socket.emit('send-msg', this.roomID, message, player);
  }

  /**
   * @description
   * Broadcast the last played move in the room namespace to synchronize with the other players
   *
   * @author
   * Rafaa Seddik
   *
   * @param player
   * the player's number
   * @param cell
   * the played cell object
   */
  emitMove(player: Player, cell: Cell): Promise<boolean> {
    return new Promise(((resolve, reject) => {
      let playerNumber = 1;
      switch (player) {
        case Player.PLAYER_1:
          playerNumber = 1;
          break;
        case Player.PLAYER_2:
          playerNumber = 2;
          break;
        case Player.PLAYER_3:
          playerNumber = 3;
          break;
        case Player.PLAYER_4:
          playerNumber = 4;
          break;
      }
      if (this.roomID) {
        this.socket.emit('move', this.roomID, playerNumber, cell.x, cell.y, () => {
          console.log('callback');
          resolve(true);
        });
      }
    }));

  }

  /**
   * @description
   *
   * @author
   * Rafaa Seddik
   * @param serialBoard
   * @param lastPlayed
   */
  sendSerialBoard(serialBoard: string, lastPlayed: number) {
    this.socket.emit('synchronize-board', this.roomID, serialBoard, lastPlayed);
  }

  /**
   * @description
   * Stores the current SocketID and the current roomID in the browser's localstorage
   *
   * @author
   * Rafaa Seddik
   */
  persistSession() {
    localStorage.setItem('clonium-session', JSON.stringify({socketID: this.socket.id, roomID: this.roomID}));
  }

  /**
   * @description
   * Deletes the session data from the browser's localstorage
   *
   * @author
   * Rafaa Seddik
   */
  removeSession() {
    localStorage.removeItem('clonium-session');
  }

  /**
   * @description
   * Checks if the is a stored session in the browser's localstorage
   *
   * @author
   * Rafaa Seddik
   */
  getStoredSession(): boolean {
    return localStorage.getItem('clonium-session') != undefined;
  }
}
