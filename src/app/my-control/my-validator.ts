import { AbstractControl, ValidationErrors } from "@angular/forms";

export function myValidator(maxLength: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlLength = (control.value || '').length;
    return controlLength > maxLength ? {myvalidator: {length: controlLength, maxLength}} : null;
  };
}