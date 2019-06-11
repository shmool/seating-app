import { Injectable } from '@angular/core';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class SeatTypesService {
  seatTypes = {
    1: { id: 1, name: 'regular', price: null, color: '#666666' },
    3: { id: 3, name: 'children', price: null, color: '#d7ff46' },
    4: { id: 4, name: 'accessible', price: null, color: '#66ccff' }
  };

  constructor(private db: DbService) {
    // const seatTypesPromise = this.db.getSeatTypes()
    //   .then(types => this.seatTypes = types)
    //   .catch(console.error);
  }
}
