import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { BankUtils } from '../../BankUtils';

export function ibanAsyncValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const ibanValue = control.value;

    if (!ibanValue) {
      return of(null); // Skip validation if input is empty
    }

    return of(ibanValue).pipe(
      debounceTime(300),
      map(() => {
        return BankUtils.validateIban(ibanValue)
          ? null // No error
          : { invalidIban: true };  // Return an error if invalid
      })
    );
  };
}