import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from './components/cell/cell.component';
import { BoardComponent } from './components/board/board.component';
import {RouterModule} from '@angular/router';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';



@NgModule({
  declarations: [CellComponent, BoardComponent, ChatBoxComponent],
  exports: [
    BoardComponent
  ],
  imports: [
   CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
