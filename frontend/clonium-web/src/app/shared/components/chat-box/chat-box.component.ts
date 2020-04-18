import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../models/player.model';
import {Message} from '../../models/message.model';
import {RoomService} from '../../../core/services/room.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html'
})
export class ChatBoxComponent implements OnInit {

  currentMessage:string;
  @Input() player:Player = Player.PLAYER_1;
  messages : Message[] = []
  displayInbox:boolean = false;
  Player=Player;
  constructor(private roomService:RoomService) { }


  ngOnInit() {

    this.roomService.receiveMessage.asObservable().subscribe(message=>{
      this.messages.push(message);
    })
  }
  submitByEnter(event){
    if (event.key === 'Enter'){
      this.sendMessage()
    }
  }
  sendMessage(){
    this.roomService.sendMessage(this.currentMessage,this.player);
    this.currentMessage="";
  }

}
