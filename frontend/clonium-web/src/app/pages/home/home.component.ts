import {Component, OnInit} from '@angular/core';
import {GameService} from '../../core/services/game.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  displayCreateModal = false;
  multiplayerMode = 'single';
  map = 'rect1';

  constructor(private router: Router, private gameService: GameService) {
  }

  ngOnInit() {
  }

  createSingleDeviceGame() {
    this.gameService.createBoard(this.map);
    this.router.navigate(['room/single-device']);
  }


}
