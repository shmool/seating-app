import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-seat',
  template: `
    <button type="button"
            (blur)="onTouched()"
            [disabled]="disabled"
            [ngClass]="{disabled: disabled}"
            [style.backgroundColor]="color"
            class="seat-ctrl">
      <span>{{ seatId + 1 }}</span>
    </button>
  `,
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatComponent implements OnInit {
  @Input() seatId;
  @Input() color;
  @Input() disabled;

  constructor() { }

  ngOnInit() {
  }

  onTouched() {

  }

}
