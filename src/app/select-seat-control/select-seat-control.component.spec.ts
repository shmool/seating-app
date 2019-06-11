import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSeatControlComponent } from './select-seat-control.component';

describe('SelectSeatControlComponent', () => {
  let component: SelectSeatControlComponent;
  let fixture: ComponentFixture<SelectSeatControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSeatControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSeatControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
