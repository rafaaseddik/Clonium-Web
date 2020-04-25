import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Player} from '../../models/player.model';
import {Message} from '../../models/message.model';
import {RoomService} from '../../../core/services/room.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html'
})
export class ChatBoxComponent implements OnInit {

  @ViewChild('scrollerList', {static: false}) scrollList;

  currentMessage: string;
  @Input() player: Player = Player.PLAYER_1;


  messages: Message[] = [];
  displayInbox: boolean = false;
  Player = Player;

  hasNewMessage = false;
  constructor(private roomService: RoomService) {
  }


  ngOnInit() {

    this.roomService.receiveMessage.asObservable().subscribe(message => {
      this.messages.push(message);
      if(this.displayInbox == false)
        this.hasNewMessage = true;
      setTimeout(() => this.scrollToBottom(), 30);
    });
  }

  submitByEnter(event) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.currentMessage.length) {
      this.roomService.sendMessage(this.currentMessage, this.player);
      this.currentMessage = '';
      setTimeout(() => this.scrollToBottom(), 30);
    }

  }

  openBox() {
    this.displayInbox = true;
    this.hasNewMessage = false;
    setTimeout(() => this.scrollToBottom(), 30);
  }

  scrollToBottom(): void {
    try {
      if (this.displayInbox) {
        this.scrollList.nativeElement.scrollTop = this.scrollList.nativeElement.scrollHeight;
      }
    } catch (err) {
    }
  }

}
