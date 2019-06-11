import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { HeaderComponent } from './header/header.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { SeatTypesFormComponent } from './seat-types-form/seat-types-form.component';
import { RoomConfigComponent } from './room-config/room-config.component';
import { SeatControlComponent } from './seat-control/seat-control.component';
import { HomeComponent } from './home/home.component';
import { SeatRowComponent } from './seat-row/seat-row.component';
import { TestComponent } from './test/test.component';
import { SelectSeatsComponent } from './select-seats/select-seats.component';
import { SeatComponent } from './seat/seat.component';
import { SelectSeatControlComponent } from './select-seat-control/select-seat-control.component';
import { SeatTakenAlertComponent } from './seat-taken-alert/seat-taken-alert.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewRoomComponent,
    SeatTypesFormComponent,
    RoomConfigComponent,
    SeatControlComponent,
    HomeComponent,
    SeatRowComponent,
    TestComponent,
    SelectSeatsComponent,
    SeatComponent,
    SelectSeatControlComponent,
    SeatTakenAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
