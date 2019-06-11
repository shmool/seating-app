import {
  AfterViewInit,
  Attribute,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Host,
  Injector,
  Input,
  OnInit,
  Optional,
  SkipSelf
} from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { SeatType } from '../db.service';
import { SeatTypesService } from '../seat-types.service';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-select-seat-control',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectSeatControlComponent),
    }
  ],
  template: `
    <button type="button"
            [style.backgroundColor]="_seatType?.color"
            (click)="select()"
            [disabled]="disabled"
            [ngClass]="{disabled: disabled, selected: _value.selected}">
      <span>{{ _value.seatId + 1 }}</span>
    </button>
  `,
  styleUrls: ['./select-seat-control.component.scss']
})
export class SelectSeatControlComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  _seatType;
  _value;
  control;

  @Input()
  set value(val) {
    this._value = val;
    this._seatType = this.seatTypesService.seatTypes[val.seatType || 1];
  }

  @Input() disabled = false;

  constructor(
    private seatTypesService: SeatTypesService,
    private cd: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer,
    private injector: Injector
  ) {

  }

  ngOnInit() {
  }

  onChange = _ => {
  };

  onTouched = () => {
  };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    // console.log('registered', fn)
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.cd.detectChanges();
  }

  select() {
    this._value = {...this._value, selected: !this._value.selected};
    this.onChange(this._value);
    this.onTouched();
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control as FormControl;

      if (this.control.value.seatId === 7) {
        console.log('control', this.control)
      }

      this.control.statusChanges.pipe(
        filter(status => status === 'INVALID'),
        tap(status => {
          // this.control.root.errors = this.control.errors;
        })
      )
        .subscribe();
    } else {
      // Component is missing form control binding
    }
  }


}
