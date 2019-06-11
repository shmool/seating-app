import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatRowComponent } from './seat-row.component';

describe('SeatRowComponent', () => {
  let component: SeatRowComponent;
  let fixture: ComponentFixture<SeatRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
