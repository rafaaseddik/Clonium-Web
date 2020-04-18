export class Message{
  sender:string;
  text:string;

  constructor(sender: string, text: string) {
    this.sender = sender;
    this.text = text;
  }
}
