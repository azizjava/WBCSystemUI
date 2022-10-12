import { UntypedFormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function findInvalidControls(fb: UntypedFormGroup) {

  const controls = fb.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
          return false;
      }
  }
  return true;
}
