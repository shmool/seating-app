import { Injectable } from '@angular/core';
import { DbService, isSeatTaken, RoomValue, RowValue, SeatsList, SeatsUpdate, Seatt, TakenSeats } from './db.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, scan, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, of, pipe } from 'rxjs';

function debounceDistinct(debounce: number) {
  return pipe(debounceTime(debounce), distinctUntilChanged());
}

interface Roww {
  seats: Array<{ seatType: number, occupied: boolean }>;
}

interface Roomm {
  rows: Array<Roww>;
}


@Injectable()
export class RoomConfigService {
  config;
  roomId;
  roomConfigForm;
  seatTypes;
  roomValue$;
  roomId$;
  roomName$;
  selectedSeats$ = new BehaviorSubject(0);
  numOfSeats$;

  roomForm;
  form;

  roomConfigForm$;

  selectSeatsErrors$ = new BehaviorSubject(null);

  constructor(private db: DbService, private route: ActivatedRoute) {

    this.numOfSeats$ = this.selectedSeats$.pipe(
      scan((acc, val) => acc + val, 0)
    );

    this.roomId$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('id'))
    );

    this.roomValue$ = this.roomId$.pipe(
      switchMap((id) => this.db.getRoom(id))
    );

    this.roomName$ = this.roomValue$.pipe(
      map((value: RoomValue) => value.roomName)
      // merge()
    );

    this.roomConfigForm$ = this.roomValue$.pipe(
      map((roomValue: RoomValue) => this.createRoomForm(roomValue))
    );

    // this.roomConfigForm$.subscribe(console.log)

  }

  createForm(room: Roomm) {
    const roomForm = new FormGroup({
      rows: new FormArray(Array.from(room.rows, (row, rowId) => {
        return new FormArray(Array.from(row.seats, (seat, seatId) => {
          const seatControl = new FormControl({
            value: {
              rowId,
              seatId,
              seatType: seat.seatType,
              selected: false,
              occupied: false
            },
            disabled: seat.occupied
          });

          // not used
          seatControl.valueChanges.subscribe(value => {
            value.occupied ? seatControl.disable() : seatControl.enable();
          });

          seatControl.statusChanges.pipe(
            filter(status => status === 'INVALID'),
            map(status => seatControl.errors),
            distinctUntilChanged()
          )
            .subscribe(errors => {
              this.selectSeatsErrors$.next(errors);
              if (errors['seatTaken']) {
                seatControl.setValue(
                  { ...seatControl.value, selected: false });
                // {emitEvent: true, onlySelf: true, emitModelToViewChange: false, emitViewToModelChange: false});
                seatControl.disable();
                setTimeout(() => this.selectSeatsErrors$.next(null), 5000);
              }
            });

          return seatControl;
        }));
      }))
    });

    this.db.seatsUpdate$.subscribe((seatsUpdate: SeatsUpdate) => {
      seatsUpdate.occupied.forEach((seat: Seatt) => {
        const control = roomForm.get(['rows', seat.rowId, seat.seatId]);
        const seatInfo = {
          rowId: seat.rowId,
          seatId: seat.seatId,
          // seatType: seat.seatType, // ???
          selected: false,
          occupied: true
        };
        // control.setValue({value: seatInfo, disabled: true});
        control.disable({ emitEvent: false });
      });
    });

    return roomForm;
  }

  isSeatOccupied(control: FormControl) {
    if (!control.value.selected) {
      return of(null);
    }
    return this.roomId$.pipe(
      switchMap(roomId => this.db.isSeatOccupied(roomId, control.value.rowId, control.value.seatId)),
      map(isOccupied => {
        return isOccupied ? { seatOccupied: true } : null;
      })
    );
  }

  getSeatSelectForm() {
    // this.isSeatOccupied()
    return this.roomValue$.pipe(
      map((roomValue: RoomValue) => {
        const form = new FormGroup({
          rows: new FormArray(Array.from(roomValue.room.rows, (row, index) => {
            return new FormGroup({
              rowNumber: new FormControl(index),
              seats: new FormArray(Array.from(row.seats, (seatType, i) => {
                const seatControl = new FormControl({
                  seatType,
                  rowId: index,
                  seatId: i,
                  selected: false
                }, { asyncValidators: isSeatTaken });
                // seatControl.registerOnChange(console.log);
                // seatControl.registerOnDisabledChange(isDisabled => console.log('disabled', isDisabled));
                seatControl.statusChanges.pipe(
                  distinctUntilChanged(),
                  tap(status => {
                    if (status === 'INVALID') {
                      this.selectSeatsErrors$.next(seatControl.errors);
                      if (seatControl.hasError('seatTaken')) {
                        seatControl.setValue(
                          { ...seatControl.value, selected: false });
                        // {emitEvent: true, onlySelf: true, emitModelToViewChange: false, emitViewToModelChange: false});
                        seatControl.disable();
                        setTimeout(() => this.selectSeatsErrors$.next(null), 5000);
                      }
                    }
                  })
                ).subscribe(status => {
                  if (status === 'VALID') {

                  }
                });
                seatControl.valueChanges.pipe(distinctUntilChanged()).subscribe(val => {
                  if (val.selected) {
                    this.selectedSeats$.next(1);
                  } else {
                    this.selectedSeats$.next(-1);
                  }
                });
                return seatControl;
                // return new FormGroup({
                //   seatType: new FormControl(seat),
                //   selected: new FormControl(false,
                //   null,
                //   isSeatTaken({ rowNumber: index, seatNumber: i }))});
              }))
            });
          }))
        });

        this.db.takenSeats$.subscribe((takenSeats: TakenSeats) => {
          takenSeats.taken.forEach((takenRow: SeatsList) => {
            takenRow.seats.forEach((takenSeat: number) => {
              const control = form.get(['rows', takenRow.row, 'seats', takenSeat]);
              // console.log(control)
              if (!control.value.selected) {
                control.disable({ emitEvent: false });
              }
            });
          });

          takenSeats.released.forEach((releasedRow: SeatsList) => {
            releasedRow.seats.forEach((releasedSeat: number) => {
              const control = form.get(['rows', releasedRow.row, 'seats', releasedSeat]);
              if (!control.value.selected) {
                control.enable({ emitEvent: false });
              }
            });
          });
        });
        return form;
      }));
  }


  createRoomForm(roomValue: RoomValue) {
    console.log(roomValue);
    const rows = new FormArray(Array.from(
      roomValue.room.rows,
      (row: RowValue) => this.generateRow(row)));

    const form = new FormGroup({
      roomName: new FormControl(roomValue.roomName, Validators.required),
      id: new FormControl(roomValue.id),
      rowCount: new FormControl(roomValue.rowCount),
      room: new FormGroup({
        rows
      })
    });

    console.log(form);
    return form;
  }

  generateNumberOfSeatsControl(numberOfSeats: number) {
    const control = new FormControl(numberOfSeats, Validators.min(1));
    control.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(val => this.changeSeatCount(control, val));
    return control;
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

  generateRow(rowValue: RowValue) {
    console.log('generate row');
    return new FormGroup({
      seatCount: this.generateNumberOfSeatsControl(rowValue.seatCount),
      seats: new FormArray(Array.from(rowValue.seats, seat => new FormControl(seat)))
    });
  }

  duplicateRow(row, rowNumber) {
    this.roomConfigForm.get('rows').insert(rowNumber, this.generateRow(row.value));
  }

  deleteRow(rowNumber) {
    this.roomConfigForm.get('rows').removeAt(rowNumber);
  }

  saveRoom(room) {
    return this.db.saveRoom(room);
  }
}
