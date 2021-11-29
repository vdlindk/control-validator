import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MyModel } from '../my-model';
import { myValidator } from './my-validator';

@Component({
  selector: 'app-my-control',
  templateUrl: './my-control.component.html',
  styleUrls: ['./my-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => MyControlComponent),
    },
  ],
})
export class MyControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  // private members
  private readonly destroy$ = new Subject<void>();
  private myInternalModel: MyModel;
  private intialFormValues: MyModel = {
    myValue: '',
  };

  // public members
  onChange = (myModel: MyModel) => {};
  onTouched = () => {};
  myInternalForm = this.fb.group(this.intialFormValues);
  get myValue(): FormControl {
    return this.myInternalForm.get('myValue') as FormControl;
  }

  constructor(private readonly fb: FormBuilder) {}

  // component life cycle hooks
  ngOnInit() {
    this.myInternalForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formValue) => this.onChange(formValue));
    //this.myValue.addValidators([myValidator(4)]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor
  writeValue(myModel: MyModel): void {
    this.myInternalForm.patchValue(myModel);
    this.applyValidators(myModel);
  }

  registerOnChange(fn: (myModel: MyModel) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Validator
  validate(control: AbstractControl): ValidationErrors {
    return this.myInternalForm.valid ? null : { myControl: true };
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onChange = fn;
  }

  // private methods
  private applyValidators(myModel: MyModel) {
    this.myValue.clearValidators();
    const maxLength = (myModel.myValue || '')
      .toLocaleLowerCase()
      .startsWith('h')
      ? 4
      : 10;
    this.myValue.addValidators([myValidator(maxLength)]);
  }
}
