import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UniqueValidators } from '../validators/unique-validators';
import { NewDbService, SeatType } from '../new-db.service';

const TYPE_COLORS = ['#666666', '#aa2222', '#00aaff', '#cccc00'];

@Component({
  selector: 'app-seat-types-form',
  template: `
    <h2>Seat types</h2>

    <form [formGroup]="seatTypesForm" clrForm (ngSubmit)="update()">

      <button type="button" class="btn btn-icon btn-sm" (click)="addType()">
        <clr-icon shape="plus"></clr-icon>
        Add type
      </button>

      <div formArrayName="types" class="clr-row">

        <div class="clr-col-lg-3 clr-col-md-4 clr-col-sm-6 clr-col-12"
             *ngFor="let type of types.controls; let i = index"
             [formGroupName]="i">
          <div class="card card-block">

            <button aria-label="Close" class="close" type="button" (click)="removeType(i)">
              <clr-icon aria-hidden="true" shape="close"></clr-icon>
            </button>

              <clr-input-container>
                <label>name </label>
                <input clrInput formControlName="name"/>
                <clr-control-error>Required</clr-control-error>
              </clr-input-container>

            <clr-input-container>
              <label>color</label>
              <input clrInput type="color" formControlName="color"/>
            </clr-input-container>

            <clr-input-container class="number-input">
              <label>price</label>
              <input clrInput type="number" formControlName="price"/>
            </clr-input-container>
            <br/>

          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-icon" [disabled]="!seatTypesForm.valid">
        <clr-icon shape="check"></clr-icon>
        Update Types
      </button>

      <div *ngIf="seatTypesForm.get('types').errors?.unique"
           class="clr-error">
        <clr-icon class="clr-validate-icon" shape="exclamation-circle"></clr-icon>
        <span class="clr-subtext form-error">All the names must be unique</span>
      </div>
    </form>
  `,
  styleUrls: ['./seat-types-form.component.scss']
})
export class SeatTypesFormComponent implements OnInit {
  types = new FormArray([], UniqueValidators.uniqueInArray('name'));
  seatTypesForm = new FormGroup({
    types: this.types
  });

  constructor(private db: NewDbService) {
  }

  ngOnInit() {
    this.db.getSeatTypes()
      .subscribe(types => {
        if (types) {
          types.forEach(type => {
            this.addType(type);
          });
        }
      });
  }

  addType(type?: SeatType) {
    type = type || {};
    const last = this.types.value[this.types.value.length - 1];
    const lastColorIndex = last ? TYPE_COLORS.findIndex(color => color === last.color) : -1;
    this.types.push(new FormGroup({
      id: new FormControl(type.id),
      name: new FormControl(type.name || '', Validators.required),
      price: new FormControl(type.price),
      color: new FormControl(type.color || TYPE_COLORS[lastColorIndex + 1 % TYPE_COLORS.length])
    }));
  }

  removeType(index) {
    this.types.removeAt(index);
  }

  update() {
    this.db.updateSeatTypes(this.types.value);
  }

}
