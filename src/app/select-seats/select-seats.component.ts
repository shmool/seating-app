import { Component, OnInit } from '@angular/core';
import { RoomConfigService } from '../room-config.service';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, merge } from 'rxjs';

@Component({
  selector: 'app-select-seats',
  template: `
    <div *ngIf="roomValue$ | async as roomValue; else loading">
      <h2>Select Seats - {{ roomValue.roomName }}</h2>
      <h3>Selected: {{ numOfSeats | async }} seats</h3>
    </div>
    <ng-template #loading>
      <h2>Loading room {{ roomId$ | async }}</h2>
    </ng-template>

    <form *ngIf="seatSelectForm"
          [formGroup]="seatSelectForm"
          class="room-config-form clr-form"
          (ngSubmit)="save()">

      <ng-template #saveBtn>
        <button type="submit" class="btn btn-success">
          <clr-icon shape="check"></clr-icon>
          Save
        </button>
      </ng-template>

      <app-seat-taken-alert *ngIf="errors$ | async as errors; else saveBtn"
                            [errorMessage]="errors.msg"
                            (close)="closeErrors$.next(null)"></app-seat-taken-alert>

      <div formArrayName="rows" class="room-config">
        <div *ngFor="let row of seatSelectForm.get('rows').controls; let i = index">
          <div [formGroupName]="i" class="clr-row seating-row">

            <div class="clr-col-sm-1 seat-num-pre">{{ row.value.rowNumber + 1 }}</div>
            <div formArrayName="seats" class="clr-col-sm-10 row-seats">
              <!--{{ row.value | json }}-->

              <app-select-seat-control
                *ngFor="let seat of seatSelectForm.get(['rows', i, 'seats']).controls; let j = index"
                [formControl]="seat"></app-select-seat-control>
            </div>
            <div class="clr-col-sm-1">{{ row.value.rowNumber + 1 }}</div>

          </div>
        </div>
      </div>

    </form>
  `,
  styleUrls: ['./select-seats.component.scss'],
  providers: [RoomConfigService]
})
export class SelectSeatsComponent implements OnInit {
  seatSelectForm;
  roomValue$;
  roomId$;
  numOfSeats;
  errors$;
  closeErrors$ = new BehaviorSubject(null);

  constructor(private roomConfigService: RoomConfigService) {
    this.roomValue$ = this.roomConfigService.roomValue$;
    this.roomId$ = this.roomConfigService.roomId$;
    this.numOfSeats = this.roomConfigService.numOfSeats$;
    roomConfigService.getSeatSelectForm().pipe(
      tap(form => {
        this.seatSelectForm = form;
      }),
      switchMap((form: FormGroup) => {
        return form.statusChanges;
      }),
      distinctUntilChanged(),
      // filter(status => status === 'INVALID'),
      map(status => {
        console.log(status);
        return this.seatSelectForm;
      })
    ).subscribe(status => {
      console.log(status);
      // if (status)
    });
    this.errors$ = merge(this.closeErrors$,
      roomConfigService.selectSeatsErrors$.pipe(
        map(errors => {
          if (!errors) {
            // return null;
          }
          if (errors && errors['seatTaken']) {
            console.log('seat taken');
            return {
              msg: `The seat you chose on row ${errors.seatTaken.checkedSeat.rowId + 1}, seat number ${errors.seatTaken.checkedSeat.seatId + 1} is taken. Please choose another seat.`,
              method: 'toaster'
            };
          }
        })
      ));
  }

  ngOnInit() {
  }

  save() {
    console.log(this.seatSelectForm.value);
  }

}
