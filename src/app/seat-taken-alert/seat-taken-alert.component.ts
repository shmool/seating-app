import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-seat-taken-alert',
  template: `
    <div class="alert alert-danger" role="alert">
      <div class="alert-items">
        <div class="alert-item static">
          <div class="alert-icon-wrapper">
            <clr-icon class="alert-icon" shape="exclamation-circle"></clr-icon>
          </div>
          <span class="alert-text">{{ errorMessage }}</span>
        </div>
      </div>
      <button type="button" class="close" aria-label="Close" (click)="close.emit()">
        <clr-icon aria-hidden="true" shape="close"></clr-icon>
      </button>
    </div>
  `,
  styleUrls: ['./seat-taken-alert.component.scss']
})
export class SeatTakenAlertComponent implements OnInit {
  @Input() errorMessage;
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
