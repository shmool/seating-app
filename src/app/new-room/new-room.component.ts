import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewDbService } from '../new-db.service';

const INIT_ROWS = 10;
const INIT_SEATS = 20;

@Component({
  selector: 'app-new-room',
  template: `
    <h1>New Room</h1>

    <form [formGroup]="roomConfig" clrForm (ngSubmit)="save()" autocomplete="off">

      <clr-input-container>
        <label>Room name: </label>
        <input clrInput formControlName="roomName">
        <clr-control-error>Required</clr-control-error>
      </clr-input-container>

      <clr-input-container>
        <label>Number of rows:</label>
        <input clrInput type="number" formControlName="rowCount">
        <clr-control-error>Must be 1 or more</clr-control-error>
      </clr-input-container>

      <clr-input-container>
        <label>Average number of seats per row:</label>
        <input clrInput type="number" formControlName="avgSeatsInRow">
        <clr-control-error>Must be 1 or more</clr-control-error>
      </clr-input-container>


      <button type="submit" class="btn btn-primary btn-icon" [disabled]="!roomConfig.valid">
        <clr-icon shape="check"></clr-icon>
        Save Room
      </button>

    </form>
  `,
  styleUrls: ['./new-room.component.scss']
})
export class NewRoomComponent implements OnInit {
  roomConfig;

  constructor(private db: NewDbService, private router: Router) {

    this.roomConfig = new FormGroup({
      id: new FormControl(),
      roomName: new FormControl('', Validators.required),
      rowCount: new FormControl(INIT_ROWS, [Validators.required, Validators.min(1)]),
      avgSeatsInRow: new FormControl(INIT_SEATS, [Validators.required, Validators.min(1)])
    });

  }

  ngOnInit() {
  }

  save() {
    this.db.saveRoomConfig(this.roomConfig.value)
      .subscribe(id => {
        console.log('room saved, id:', id);
        this.router.navigate(['/room-config', id]);
      });

  }
}
