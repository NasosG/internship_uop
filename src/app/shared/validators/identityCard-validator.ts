import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

export function adtAsyncValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const raw = control.value;

    if (!raw) {
      return of(null); // Skip validation if input is empty
    }

    return of(raw).pipe(
      debounceTime(300),
      map((value) => {
        const normalized = value
          .toString()
          .trim()
          .replace(/[\s\-.]/g, '') // removes spaces, hyphens, dots
          .toUpperCase();

        const ADT_REGEX = /^[A-ZΑ-Ω]{1,2}\d{6,8}$/;

        return ADT_REGEX.test(normalized)
          ? null
          : { invalidAdt: true };
      })
    );
  };
}
