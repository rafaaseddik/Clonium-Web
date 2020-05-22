import {Player} from './player.model';

/**
 * @description
 * A message model class
 *
 * @author
 * Rafaa Seddik
 */
export class Message{
  sender:Player;
  text:string;

  constructor(sender: Player, text: string) {
    this.sender = sender;
    this.text = text;
  }
}
