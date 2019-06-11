import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatControlComponent } from './seat-control.component';

describe('SeatControlComponent', () => {
  let component: SeatControlComponent;
  let fixture: ComponentFixture<SeatControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
