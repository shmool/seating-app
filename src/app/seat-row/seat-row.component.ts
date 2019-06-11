import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-seat-row',
  template: `
    <div [formGroup]="group"
         class="seating-rows-config clr-row">
      <div class="clr-col-sm-1">
        <input type="number" formControlName="seatCount">
      </div>

      <div class="clr-col-sm-1 row-number">
        <span>{{ i + 1 }}</span>
      </div>

      <div formArrayName="seats" class="clr-col-sm-8 row-seats">
        <app-seat-control *ngFor="let seat of row.get(['seats']).controls; let j=index"
                          [seatId]="j"
                          [formControlName]="j"></app-seat-control>
      </div>

      <div class="clr-col-sm-2">
        <button type="button"
                class="btn btn-icon btn-sm btn-primary btn-row-action"
                (click)="duplicateRow(row, i)">
          <clr-icon shape="copy"></clr-icon>
        </button>
        <button type="button"
                class="btn btn-icon btn-sm btn-warning btn-row-action"
                (click)="deleteRow(i)">
          <clr-icon shape="remove"></clr-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./seat-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatRowComponent implements OnInit {
  @Input() i;
  @Input() group;
  @Input() row;

  constructor() {
  }

  ngOnInit() {
  }

  changeSeatCount(control, val) {
    const seatsControl = <FormArray>control.parent.get('seats');
    const gap = val - seatsControl.length;
    const repeater = Array(Math.abs(gap)).fill(null);
    if (gap > 0) {
      repeater.forEach(_ => {
        seatsControl.push(new FormControl());
      });
    } else if (gap < 0) {
      const result = confirm(`Remove ${-gap} seats?`);
      if (result) {
        repeater.forEach(_ => {
          seatsControl.removeAt(val);
        });
      }
    }
  }

}
