import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { BehaviorSubject, from, interval, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

const DEFAULT_ROW_COUNT = 5;
const DEFAULT_SEATS_IN_ROW_COUNT = 20;

export interface RoomConfig {
  id?: number;
  roomName: string;
  rowCount: number;
  avgSeatsInRow: number;
  room?: {
    rows?: Array<{ seats: Array<number> }>; // seating = rows of seats w/ type id
  };
}

export interface SeatType {
  id?: number;
  name?: string;
  color?: string;
  price?: number;
}

export interface RowValue {
  seatCount: number;
  seats: Array<number>;
}

export interface RoomValue {
  roomName: string;
  id: number;
  rowCount: number;
  room: {
    rows: Array<RowValue>;
  };
}

export interface Seat {
  rowNumber: number;
  seatNumber: number;
}

export interface Seatt {
  rowId: number;
  seatId: number;
}
export interface SeatsUpdate {
  occupied: Array<Seatt>;
  released: Array<Seatt>;
}

function toRoomFormValue(roomConfig: RoomConfig) {
  const room = roomConfig.room || {
    rows: Array.from({ length: roomConfig.rowCount }, (row) => ({
      seatCount: roomConfig.avgSeatsInRow,
      seats: Array.from({ length: roomConfig.avgSeatsInRow })
    }))
  };
  return {
    ...roomConfig,
    room
  };
}

function toSelectSeatsValue(roomConfig: RoomConfig) {
  return {
    room: roomConfig.room
  };
}

export interface SeatsList {
  row: number;
  seats: number[];
}

export interface TakenSeats {
  taken: Array<SeatsList>;
  released: Array<SeatsList>;
}

const takenSeats: TakenSeats[] = [
  { taken: [{ row: 1, seats: [1, 2, 3, 4] }, { row: 2, seats: [1, 2, 6, 7, 8] }], released: [] },
  { taken: [{ row: 1, seats: [5, 6, 10, 11] }, { row: 2, seats: [10, 11, 12] }, { row: 2, seats: [16, 17, 18] }], released: [] },
  { taken: [], released: [{ row: 1, seats: [1, 2, 3] }] },
  { taken: [{ row: 3, seats: [12, 13, 14, 15] }], released: [] }
];

const takenSeats$ = interval(5000).pipe(
  map(val => takenSeats[val % takenSeats.length])
  // tap(v => console.log(v))
);
/*function deNormalize(roomConfig: RoomConfig): RoomValue {
  console.log(roomConfig)
  const numberOfRows = roomConfig.room.rows.length;
  const seating = roomConfig.room && roomConfig.room.rows ?
                  roomConfig.room.rows.map(row => ({ ...row, numberOfSeats: row.seats.length })) :
                  new Array(roomConfig.rowCount || DEFAULT_ROW_COUNT).fill({
                    seats: new Array(DEFAULT_SEATS_IN_ROW_COUNT),
                    numberOfSeats: DEFAULT_SEATS_IN_ROW_COUNT
                  });
  // console.log(seating)
  return {
    roomName: roomConfig.roomName,
    roomId: roomConfig.id,
    numberOfRows,
    seating
  };
}*/

/*function normalize(roomValue: RoomValue): RoomConfig {
  return {
    roomName: roomValue.roomName,
    id: roomValue.roomId,
    rowCount: roomValue.seating.length,
    avgSeatsInRow: DEFAULT_SEATS_IN_ROW_COUNT,
    room: {
      rows: roomValue.seating.map(rowValue => ({seats: rowValue.seats}))
    }
  };
}*/

export function isSeatTaken(c: FormControl) {
  // return (c: FormControl) => {
  // console.log(c, checkedSeat)
  // const checkedSeat = checkedSeatControl.parent.
  // console.log(c.value);
  if (!c.value.selected) {
    return of(null);
  }
  const checkedSeat = { seatId: c.value.seatId, rowId: c.value.rowId };
  console.log(checkedSeat)
  return of(checkedSeat.seatId === 7 ? { seatTaken: { checkedSeat } } : null).pipe(
    delay(1000),
    tap(res => {
      console.log('async:', res);
      // if (checkedSeat.seatNumber === 7) {
      //   takenSeats.push({ taken: [{ row: checkedSeat.rowNumber, seats: [7] }], released: [] });
      // }
    })
  );
  // }
}


@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  roomConfigs: Dexie.Table<RoomConfig, number>;
  seatTypes: Dexie.Table<SeatType, number>;
  takenSeats$ = takenSeats$;
  seatsUpdate$: BehaviorSubject<SeatsUpdate> = new BehaviorSubject(null);

  constructor() {

    super('RoomsDemo');

    this.version(5).stores({
      roomConfigs: '++id, name',
      seatTypes: '++id, name'
    });

    this.on('populate', () => {
      this.seatTypes.add({ id: 1, name: 'regular', price: null, color: '#666666' });
    });

    // takenSeats$.subscribe(console.log)
  }

  isSeatOccupied(roomId, rowId, seatId) {
    return of(true);
  }

  saveRoomConfig(config) {
    if (!config.id) { // id === null, need to remove so dexie will generate id
      delete config.id;
    } // else - updating an existing config
    return this.roomConfigs.put(config);
  }

  getRoomConfig(index) {
    return index ? this.roomConfigs.get(+index) : Promise.resolve(null);
  }

  getRoomConfigs() {
    return this.roomConfigs.toArray();
  }

  getSeatTypes() {
    return this.seatTypes.toArray();
  }

  getTypes() {
    return from(this.getSeatTypes());
  }

  updateSeatTypes(types) {
    this.seatTypes.clear();
    types.forEach(type => {
      if (type.id) {
        this.seatTypes.put(type);
      } else {
        delete type.id;
        this.seatTypes.add(type);
      }
    });
  }

  getRoom(index) {
    return from(this.getRoomConfig(index)).pipe(
      map(room => {
        return toRoomFormValue(room);
      })
    );
  }

  saveRoom(config) {
    return from(this.saveRoomConfig(config));
  }

  getRoomForSelecting(index) {
    return from(this.getRoomConfig(index)).pipe(
      map(room => {
        return toSelectSeatsValue(room);
      })
    );
  }

}
