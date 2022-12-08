import { AbstractControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function patternNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } |null => {
      if (!control.value) {
        return null;
      }
      let valid ;
      if (typeof control.value === 'number') {
        valid = control.value
          .toString()
          .match(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/);
      } else {
        valid = control.value.match(
          /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/
        );
      }
      return valid ? null : { invalidNumberFormat: true };
    };
  }
