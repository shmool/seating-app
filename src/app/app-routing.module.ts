import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatTypesFormComponent } from './seat-types-form/seat-types-form.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { RoomConfigComponent } from './room-config/room-config.component';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { SelectSeatsComponent } from './select-seats/select-seats.component';

const routes: Routes = [
  { path: 'new-room', component: NewRoomComponent },
  { path: 'room-config/:id', component: RoomConfigComponent },
  { path: 'seat-types', component: SeatTypesFormComponent },
  { path: 'select/:id', component: SelectSeatsComponent },
  { path: 'test', component: TestComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
