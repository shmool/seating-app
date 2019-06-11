import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { from } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class NewDbService extends Dexie {
  roomConfigs: Dexie.Table<RoomConfig, number>;
  seatTypes: Dexie.Table<SeatType, number>;

  constructor() {

    super('SeatingAppDemo');

    this.version(1).stores({
      roomConfigs: '++id, name',
      seatTypes: '++id, name'
    });

    this.on('populate', () => {
      this.seatTypes.add({ id: 1, name: 'regular', price: null, color: '#666666' });
    });
  }

  saveRoomConfig(config) {
    if (!config.id) { // id === null, need to remove so dexie will generate id
      delete config.id;
    } // else - updating an existing config
    return from(this.roomConfigs.put(config));
  }

  getSeatTypes() {
    return from(this.seatTypes.toArray());
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
}
