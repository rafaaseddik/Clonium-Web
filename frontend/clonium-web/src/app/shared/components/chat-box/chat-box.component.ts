import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../models/player.model';
import {Message} from '../../models/message.model';
import {RoomService} from '../../../core/services/room.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html'
})
export class ChatBoxComponent implements OnInit {

  @Input() roomID:string;
  @Input() player:Player;
  messages : Message[] = []

  constructor(private roomService:RoomService) { }

  ngOnInit() {
  }

}
