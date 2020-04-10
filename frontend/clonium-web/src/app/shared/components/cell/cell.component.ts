import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cell} from '../../models/cell.model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html'
})
export class CellComponent implements OnInit {

  @Input() cell: Cell;
  @Output() exploded: EventEmitter<Cell> = new EventEmitter<Cell>();

  constructor() {
  }

  ngOnInit() {
  }

  increment() {

  }


}
