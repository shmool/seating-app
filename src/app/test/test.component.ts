import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-test',
  template: `
    <form [formGroup]="form">
      <input formControlName="name">
    </form>
    
    <button (click)="patch()">patch</button>
  `,
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  constructor() {
  }

  get name() {
    return this.form.get('name');
  }
  ngOnInit() {

    this.name.statusChanges.subscribe(console.log)

    this.name.valueChanges.pipe(
      tap(console.log),
      filter(val => val === 'x')
    )
      .subscribe(val => {
      console.log(val)
        this.name.disable({emitEvent: false})
    })
  }

  patch() {
    this.name.setValue('xyz');
    this.name.disable();
    // this.name.setValue({value: 'xx', disabled: true});
    /*this.form.setValue(
      {value: {
      name: 'x'
    }, disabled: true});*/
  }

}
