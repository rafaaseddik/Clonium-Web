import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from './components/cell/cell.component';
import { BoardComponent } from './components/board/board.component';



@NgModule({
  declarations: [CellComponent, BoardComponent],
  exports: [
    BoardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
