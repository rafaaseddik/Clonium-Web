import {Component, OnInit} from '@angular/core';
import {GameService} from '../../core/services/game.service';
import {Router} from '@angular/router';
import {RoomService} from '../../core/services/room.service';
import Swal from 'sweetalert2';
import {MapTemplateName} from '../../shared/models/board.model';

/**
 * @description
 * The home screen component
 * In this page you can :
 *    - Create game and configure it (the map template, the number of players, the map size, and game Mode: Online/Fffline)
 *    - Rejoin an old room
 *
 * @author
 * Rafaa Seddik
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  // Toggle the display of the game creation Modal
  displayCreateModal = false;
  // Toggle the game mode
  multiplayerMode:'single'|'online' = 'single';
  // Toggle the display of the game rules TODO : Re-integrate the rules element in the UI
  showRules = false;
  // Toggle the display of the 'Continue game' button
  hasSession: boolean = false;

  // The game players number, the game supports from 2 up to 4 players
  playersNumber: number = 2;
  // The map template name, the game currently supports 3 templates : rect1, rect2, rect3
  map:MapTemplateName = 'rect1';
  // The game is a square matrix, side is the matrix dimension (example : if side=3 => the board is a 3x3 matrix)
  side: number = 8;

  /**
   * Check if there is a stored session to configure the 'Continue game' button
   */
  constructor(private router: Router, private gameService: GameService, private roomService: RoomService) {
    this.hasSession = this.roomService.getStoredSession();
  }

  ngOnInit() {
  }

  /**
   * @description
   * Calls the corresponding game creation mode, according the the multi-player mode value
   *
   * @author
   * Rafaa Seddik
   */
  createGame() {
    if (this.multiplayerMode == 'single') {
      this.createSingleDeviceGame();
    } else {
      this.createOnlineGame();
    }
  }

  /**
   * @description
   * Creates an offline game board and go to the singe-device-room.component
   *
   * @author
   * Rafaa Seddik
   *
   */
  createSingleDeviceGame() {
    this.gameService.createBoard(this.map, this.playersNumber, this.side);
    this.router.navigate(['room/single-device']);
  }

  /**
   * @description
   * Creates an online game board and go to the online-room.component
   * @author
   * Rafaa Seddik
   *
   */
  createOnlineGame() {
    this.roomService.createRoom(this.map, this.playersNumber, this.side).then((roomID) => {
      this.gameService.createOnlineBoard(this.map, this.playersNumber, this.side);
      this.router.navigate(['room/online']);
    });

  }

  /**
   * @description
   * Toggles the multiplayer mode value
   *
   * @author
   * Rafaa Seddik
   *
   * @param mode
   * the multiplayer mode 'single'|'online'
   */
  selectGameMode(mode: 'single'|'online') {
    this.multiplayerMode = mode;
  }

  /**
   * @description
   * Toggles the map template name
   *
   * @author
   * Rafaa Seddik
   *
   * @param mapName
   * The game currently supports 3 templates : rect1, rect2, rect3
   */
  selectMap(mapName: MapTemplateName) {
    this.map = mapName;
  }

  /**
   * @description
   * Joins an old session. If successful, go to the online-room.component
   *                        else, show an alert
   * @author
   * Rafaa Seddik
   *
   */
  joinOldSession() {

    this.roomService.rejoinRoom().then(result => {
      this.gameService.joinOnlineBoard(result.mapName, result.playersNumber, result.currentPlayer, result.side,result.serialBoard,result.currentState);
      this.router.navigate(['room/online']);
    }).catch(e => {
      Swal.fire({html: 'Room not found', icon: 'error'})
    })
  }


}
