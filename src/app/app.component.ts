import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      // first argument is the default value
      // second argument is the validator
      // can be a list of validators as array
      'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      'gender': new FormControl('male'),
      'address': new FormGroup({
        'street': new FormControl(null, Validators.required),
        'city': new FormControl(null, Validators.required),
      }),
      'hobbies': new FormArray([]) // empty array
    });
    this.signupForm.valueChanges.subscribe(
      (value) => console.log('value', value)
    );
    this.signupForm.statusChanges.subscribe(
      (status) => console.log('status', status)
    );
    // set value
    this.signupForm.setValue({
      'username': 'Max',
      'email': 'max@test.com',
      'gender': 'male',
      'address': {
        'street': 'Main st.',
        'city': 'New York',
      },
      'hobbies': []
    });
    // patch value
    this.signupForm.patchValue({
      'username': 'Anna',
    });

  }

  onAddHobby() {
    // casting to FormArray
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }


  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      // return an object if the validation fails
      return { 'nameIsForbidden': true };
    }
    // return null if the validation succeeds
    return null;
  }
  // async validator
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({ 'emailIsForbidden': true });
        }
        else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }


  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }
}
