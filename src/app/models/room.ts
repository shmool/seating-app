import { NewRoom } from './new-room';

export interface Room {
  id: number;
  name: string;
  rows: Array<Array<number>>; // seat type id
}

export interface RoomForm {

}