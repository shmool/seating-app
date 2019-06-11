import { Component, Input, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { ActivatedRoute } from '@angular/router';
import { RoomConfigService } from '../room-config.service';

@Component({
  selector: 'app-room-config',
  template: `
    <div *ngIf="roomValue$ | async as roomValue; else loading">
      <h2>{{ roomValue.roomName }}</h2>
      <button *ngIf="!editRoomName" (click)="editRoomName = true" class="btn">Edit room name</button>
    </div>
    <ng-template #loading>
      <h2>Loading room {{ roomId$ | async }}</h2>
    </ng-template>

    <form *ngIf="roomConfigForm"
          [formGroup]="roomConfigForm"
          class="room-config-form clr-form"
          (ngSubmit)="save()">

      <input *ngIf="editRoomName" formControlName="roomName" clrInput>

      <button type="submit" class="btn btn-success">
        <clr-icon shape="check"></clr-icon>
        Save
      </button>

      <div formGroupName="room">
        <div formArrayName="rows" class="room-config">
          <app-seat-row *ngFor="let row of roomConfigForm.get('room.rows').controls; let i = index"
                        [i]="i" [group]="row" [row]="row"
                        class="seating-rows-config">

          </app-seat-row>
        </div>
      </div>

    </form>
  `,
  styleUrls: ['./room-config.component.scss'],
  providers: [RoomConfigService]
})
export class RoomConfigComponent implements OnInit {
  @Input() config;
  roomId$;
  seatTypes;
  roomValue$;
  editRoomName = false;
  roomConfigForm;

  constructor(private db: DbService, private route: ActivatedRoute, public roomConfigService: RoomConfigService) {
    this.roomValue$ = this.roomConfigService.roomValue$;
    this.roomId$ = this.roomConfigService.roomId$;
    roomConfigService.roomConfigForm$.subscribe(form => this.roomConfigForm = form);

  }

  ngOnInit() {
    /*this.roomConfigService.roomConfigForm.submitted().subscribe(val => {
      console.log('submitted', val);
      this.editRoomName = false;
    });*/
  }


  save() {
    // console.log(this.roomConfigService.config, this.roomConfigService.roomConfigForm.value)
    this.roomConfigService.saveRoom(this.roomConfigForm.value);
    this.editRoomName = false;
  }


}
