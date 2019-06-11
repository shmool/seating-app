import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatTypesFormComponent } from './seat-types-form.component';

describe('SeatTypesFormComponent', () => {
  let component: SeatTypesFormComponent;
  let fixture: ComponentFixture<SeatTypesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatTypesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatTypesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
