import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import {RouterModule} from '@angular/router';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [BoardComponent, ChatBoxComponent],
  exports: [
    BoardComponent,ChatBoxComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class SharedModule { }
