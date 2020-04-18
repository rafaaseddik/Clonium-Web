import {Player} from './player.model';

export class Message{
  sender:Player;
  text:string;

  constructor(sender: Player, text: string) {
    this.sender = sender;
    this.text = text;
  }
}
