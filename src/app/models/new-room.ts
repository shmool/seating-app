import { FormControl } from '@angular/forms';

export interface NewRoom {
  id?: number;
  roomName: string;
  rowCount: number;
  avgSeatsInRow: number;
}

export interface NewRoomForm {
  roomName: FormControl;
  rowCount: FormControl;
  avgSeatsInRow: FormControl;
}
