import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatTakenAlertComponent } from './seat-taken-alert.component';

describe('SeatTakenAlertComponent', () => {
  let component: SeatTakenAlertComponent;
  let fixture: ComponentFixture<SeatTakenAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatTakenAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatTakenAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
