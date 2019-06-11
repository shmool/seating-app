import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, forwardRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SeatType } from '../db.service';
import { SeatTypesService } from '../seat-types.service';

@Component({
  selector: 'app-seat-control',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SeatControlComponent),
    }
  ],
  template: `
    <clr-dropdown class="seat">
      <button type="button"
              (blur)="onTouched()"
              clrDropdownTrigger
              [style.backgroundColor]="selectedType?.color">
        <span>{{ seatId + 1 }}</span>
      </button>

      <clr-dropdown-menu class="dropdown-menu">
        <button *ngFor="let type of _seatTypesArray"
                clrDropdownItem
                type="button"
                class="dropdown-item"
                (click)="setType(type)">
          <div class="seat-type-box" [style.backgroundColor]="type.color"></div>
          {{ type.name }}
        </button>
      </clr-dropdown-menu>

    </clr-dropdown>
  `,
  styleUrls: ['./seat-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatControlComponent implements ControlValueAccessor, OnChanges, DoCheck {
  @Input()
  set seatId(id) {
    // console.log('setting seatId');
    this._seatId = id;
  }

  get seatId() {
    // console.log('getting seatId');
    return this._seatId;
  }

  _seatId;

  set seatTypes(types) {
    this._seatTypes = types;
    this._seatTypesArray = Object.values(types);
    if (this._value && this._seatTypes) {
      this.findSeatType();
    }
  }

  @Input()
  set value(seatTypeId) {
    this._value = seatTypeId || this._seatTypesArray[0].id;
    if (this._seatTypes) {
      this.findSeatType();
    }
  }

  @Input() disabled = false;

  selectedType: SeatType = {};
  _seatTypes;
  _seatTypesArray;
  _value;

  constructor(private seatTypesService: SeatTypesService, private renderer: Renderer2, private cd: ChangeDetectorRef) {
    this.seatTypes = seatTypesService.seatTypes;
  }

  private findSeatType() {
    this.selectedType = this._seatTypes[this._value];
  }

  onChange = _ => {
  };

  onTouched = () => {
  };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.cd.detectChanges();
  }

  setType(type) {
    this.value = type.id;
    this.onChange(type.id);
    this.onTouched();
  }

  ngOnChanges() {
    // console.log('changes');
  }

  ngDoCheck() {
    // console.log('check')
  }

}
