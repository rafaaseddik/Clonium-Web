import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Player} from '../../models/player.model';
import {Message} from '../../models/message.model';
import {RoomService} from '../../../core/services/room.service';

/**
 * @description
 * The chatbox UI component, available only in an online game
 *
 * @author
 * Rafaa Seddik
 */
@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html'
})
export class ChatBoxComponent implements OnInit {

  // The messages list scroller element reference
  @ViewChild('scrollerList', {static: false}) scrollList;
  // The current player
  @Input() player: Player = Player.PLAYER_1;
  // The current message content
  currentMessage: string = "";
  // The list of messages
  messages: Message[] = [];
  // Toggle the display of the messages list
  displayInbox: boolean = false;
  // Toggle the display of a newly received message notification icon
  hasNewMessage = false;
  // Type declaration
  Player = Player;


  constructor(private roomService: RoomService) {
  }


  /**
   * Subscribe to the receiveMessage Socket Event
   */
  ngOnInit() {
    this.roomService.receiveMessage.asObservable().subscribe(message => {
      this.messages.push(message);
      if(this.displayInbox == false)
        this.hasNewMessage = true;
      setTimeout(() => this.scrollToBottom(), 30);
    });
  }


  /**
   * @description
   * The send message event handler
   * @author
   * Rafaa Seddik
   */
  sendMessage() {
    if (this.currentMessage.length) {
      this.roomService.sendMessage(this.currentMessage, this.player);
      this.currentMessage = '';
      setTimeout(() => this.scrollToBottom(), 30);
    }

  }

  /**
   * @description
   * Opens the list of message box
   * @author
   * Rafaa Seddik
   */
  openBox() {
    this.displayInbox = true;
    this.hasNewMessage = false;
    setTimeout(() => this.scrollToBottom(), 30);
  }

  /**
   * @description
   * Scroll to the bottom of the list messages
   * @author
   * Rafaa Seddik
   */
  scrollToBottom(): void {
    try {
      if (this.displayInbox) {
        this.scrollList.nativeElement.scrollTop = this.scrollList.nativeElement.scrollHeight;
      }
    } catch (err) {
    }
  }

}
