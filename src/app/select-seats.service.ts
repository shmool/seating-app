import { Injectable } from '@angular/core';
import { DbService, isSeatTaken, RoomValue, SeatsUpdate, Seatt } from './db.service';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, map, scan, startWith, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SelectSeatsService {
  numOfSeats$: Observable<number>;
  roomId$: Observable<string>;
  room$;
  roomName$: Observable<string>;
  roomConfigForm$: Observable<any>;
  selectSeatsErrors$ = new BehaviorSubject(null);
  seatsValueChanges$$ = [];

  constructor(private db: DbService, private route: ActivatedRoute) {

    this.roomId$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
    );

    this.room$ = this.roomId$.pipe(
      switchMap((id) => this.db.getRoom(id))
    );

    this.roomName$ = this.room$.pipe(
      map((value: RoomValue) => value.roomName)
    );

    this.roomConfigForm$ = this.room$.pipe(
      map((room: RoomValue) => this.createRoomForm(room.room))
    );

    this.numOfSeats$ = this.roomConfigForm$.pipe(
      switchMap(form => {
        return merge(...this.seatsValueChanges$$)
          .pipe(
            scan((acc, val) => acc + val, 0),
            startWith(0)
          );
      })
    );

  }

  createRoomForm(roomConfig) {
    /**
     *
     * form structure:
     * {
     *   rows: [
     *     {
     *       rowNumber,
     *       seats: [
     *           Control(rowId, seatId, seatType, selected)
     *       ]
     *     }
     *   ]
     * }
     */
    // console.log(roomConfig);
    const roomForm = new FormGroup({
      rows: new FormArray(roomConfig.rows.map((row, rowId) => {
        const rowGroup = new FormGroup({ rowNumber: new FormControl(rowId) });

        const seatsArray = new FormArray(row.seats.map((seatType, seatId) => {

          const seatControl = new FormControl({
            rowId,
            seatId,
            seatType,
            selected: false,
          });

          seatControl.setAsyncValidators(isSeatTaken);

          seatControl.statusChanges.pipe(
            filter(status => status === 'INVALID'),
            map(status => seatControl.errors),
            distinctUntilChanged()
          )
            .subscribe(errors => {
              this.selectSeatsErrors$.next(errors);
              if (errors['seatOccupied']) {
                seatControl.setValue(
                  { ...seatControl.value, selected: false });
                seatControl.disable();
                setTimeout(() => this.selectSeatsErrors$.next(null), 5000);
              }
            });


          this.seatsValueChanges$$.push(
            seatControl.valueChanges.pipe(
              distinctUntilChanged(),
              map(val => val.selected ? 1 : -1),
            )
          );

          return seatControl;
        }));
        rowGroup.addControl('seats', seatsArray);
        return rowGroup;
      }))
    });

    this.db.seatsUpdate$.subscribe((seatsUpdate: SeatsUpdate) => {
      seatsUpdate.occupied.forEach((seat: Seatt) => {
        const control = roomForm.get(['rows', seat.rowId, 'seats', seat.seatId]);
        control.disable({ emitEvent: false });
      });

      seatsUpdate.released.forEach((seat: Seatt) => {
        const control = roomForm.get(['rows', seat.rowId, 'seats', seat.seatId]);
        control.enable({ emitEvent: false });
      });
    });

    return roomForm;
  }


}
