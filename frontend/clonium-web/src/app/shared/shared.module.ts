import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from './components/cell/cell.component';
import { BoardComponent } from './components/board/board.component';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [CellComponent, BoardComponent],
  exports: [
    BoardComponent
  ],
  imports: [
   CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
