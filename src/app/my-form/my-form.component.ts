import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MyModel } from '../my-model';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
  styleUrls: ['./my-form.component.css'],
})
export class MyFormComponent implements OnInit, OnChanges, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @Input() myModel: MyModel;
  @Output() myModelChanged = new EventEmitter<MyModel>();

  parentForm = this.fb.group({
    myModel: undefined,
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.parentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formValues) => {
        if (this.parentForm.valid) {
          const { myModel } = formValues;

          this.myModelChanged.emit(myModel);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.parentForm) {
      this.parentForm.patchValue({ myModel: this.myModel });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
