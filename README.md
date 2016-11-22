# vadacl
vadacl ("validation at domain and component levels") is a small TypeScript library for Angular 2 that enhances the reactive form validation features provided in Angular 2.  It provides a means by which developers can set domain/database-based 
validation rules on data objects but then augment or override those validations as needed within different components.
It also lets developers add and override validation error messages that are added to the validation metadata returned 
by the validation methods.

## Explanation By Example

Imagine your Angular 2 applications serves two types of users:  customers and admin users.  Both types of users can edit
their own user profile, which your application retrieves from the corresponding UserProfile record in your database.
The UserProfile table contains the following columns:

* firstName (not nullable, maxlength 25 characters)
* lastName (not nullable, maxlength 25 characters)
* username (not nullable, maxlength 30 characters)
* age (nullable, integer)
* gender (nullable, single character: M or F)

Your application needs to apply the following (somewhat arbitrary) business rules regarding user profile data:

* Customers are required to provide values for the demographics fields (age, gender); admin users are not.
* Customer usernames must be at least 8 characters long; admin usernames can be as short as 3 characters.
* Customer and admins have separate components/forms for editing their user profile data.
* Validation errors should be display beneath the form inputs, and should be context-appropriate.

This is how you could implement validation with vadacl that addresses all of these validation and business rules:

Create a domain class with properties that will hold the data from the UserProfile database record retrieved by your application:

```javascript
export class UserProfile {
    firstName: string = null;
    lastName: string = null;
    username: string = null;
    age: number = null;
    gender: string = null;
}    
```

Now refactor the class to implement vadacl's Validatable interface, and add a "validations" property with validation settings
that adhere to the PropertyValidations interface and validation settings interfaces.  All of these interfaces are defined in 
the interfaces.ts file within the vadacl folder.  Now your UserProfile domain class looks like this:

```javascript
import { Validatable, PropertyValidations } from '../vadacl/interfaces'

export class UserProfile implements Validatable {
    firstName: string = null;
    lastName: string = null;
    username: string = null;
    age: number = null;
    gender: string = null;

    validations: { [ index: string ] : PropertyValidations } = {
        firstName: {
            maxLength: { maxLength: 25, message: 'Your first name cannot be longer than 25 characters.'},
            required: { message: 'Your first name is required.' }
        },
        lastName: {
            maxLength: { maxLength: 25, message: 'Your last name cannot be longer than 25 characters.'},
            required: { message: 'Your last name is required.' }
        },
        username: {
            maxLength: { maxLength: 30, message: 'Your username cannot be longer than 25 characters.'},
            required: { message: 'You must have a username.' }
        },
        age: {
            pattern: { pattern: '[0-9]*', message: 'Enter your age as an integer.' }
        },
        gender: {
            pattern: { pattern: 'M|F', message: 'Enter your gender as "M" or "F".' }
        }
    };
}    
```

In vadacl parlance, these validations are the "domain validations" referred to in the vadacl acronym.  They can also be
thought of as "persistence" validations:  if you send back UserProfile property values that don't adhere to these validation
rules back to your database to be saved/persisted, the save attempt will fail.  Such validation constraints should be
applied consistently throughout your application.

One quick note before moving on:  applying the interfaces is strictly optional, but doing so will help your IDE and 
TypeScript compiler alert you to any mistakes or omissions you may make in the validation settings.

Now create the CustomerProfileComponent that your customer users will use to edit their profile.  First, code the
component as if it was going to implement the form using Angular's reactive form controls in a standard manner (minus the
use of any Validators):

```javascript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserProfile } from '../../domain/user-profile';

@Component({
    moduleId: module.id,
    selector: 'views-customer-profile',
    templateUrl: 'customer-profile.component.html'
})

export class CustomerProfileComponent implements OnInit {

    pageReady: boolean = false;
    profileForm: FormGroup;
    userProfile: UserProfile;

    constructor() {}

    ngOnInit() {
        this.userProfile = new UserProfile();

        this.profileForm = new FormGroup({
            'firstName': new FormControl( this.userProfile.firstName ),
            'lastName': new FormControl( this.userProfile.lastName ),
            'username': new FormControl( this.userProfile.username ),
            'age': new FormControl( this.userProfile.age ),
            'gender': new FormControl( this.userProfile.gender )
        });

        this.pageReady = true;
    }

}  
```

Now refactor the class to extend the Vadacl class, giving the class access to the methods in the vadacl.ts file.  Add 
the validation settings needed to implement the user profile business logic that applies to customer users, and then
configure the validation behavior for the form fields using that customer-specific business logic as needed via vadacl's
applyRules() method:

```javascript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserProfile } from '../../domain/user-profile';
import { Vadacl } from '../../vadacl/vadacl';

@Component({
    moduleId: module.id,
    selector: 'views-customer-profile',
    templateUrl: 'customer-profile.component.html'
})

export class CustomerProfileComponent extends Vadacl implements OnInit {

    pageReady: boolean = false;
    profileForm: FormGroup;
    userProfile: UserProfile;

    constructor() {
        super();
    }

    ngOnInit() {
        this.userProfile = new UserProfile();
        
        let componentValidations = {
            username: { 
                minLength: { minLength: 8, message: 'Your username must be at least 8 characters long.' }
            },
            age: {
                required: { message: 'You must provide your age.' }
            },
            gender: {
                required: { message: 'You must provide your gender.' }
            }
        }

        this.profileForm = new FormGroup({
            'firstName': new FormControl(
                this.userProfile.firstName,
                this.applyRules( this.userProfile, 'firstName')
            ),
            'lastName': new FormControl(
                this.userProfile.lastName,
                this.applyRules( this.userProfile, 'lastName' )
            ),
            'username': new FormControl(
                this.userProfile.username,
                this.applyRules( this.userProfile, 'username', componentValidations.username )
            ),
            'age': new FormControl(
                this.userProfile.age,
                this.applyRules( this.userProfile, 'age', componentValidations.age )
            ),
            'gender': new FormControl(
                this.userProfile.gender,
                this.applyRules( this.userProfile, 'gender', componentValidations.gender )
            )
        });

        this.pageReady = true;
    }

}
```

The applyRules() method of the Vadacl class is the heart of vadacl.  It uses the domain object and property name arguments
to obtain the validation rules for that property set in the data object, then adds to or overrides those settings with any
new validation settings provided in the 3rd argument.  It then uses that combination of domain validation settings and
component-level validation settings to produce an array of validator methods that can be returned as the 2nd argument to 
the FormControl constructor.

The AdminProfileComponent used to let admin users edit their user profile would be constructed in a similar way, but 
would apply a different set of component-level validation settings:

```javascript
let componentValidations = {
    firstName: {
        required: { message: 'The firstName field is required.'}
    },
    lastName: {
        required: { message: 'The lastName field is required.'}
    },
    username: {
        minLength: { minLength: 3, message: 'The username must be at least 3 characters long.' }
    }
};

this.profileForm = new FormGroup({
    'firstName': new FormControl(
        this.userProfile.firstName,
        this.applyRules( this.userProfile, 'firstName', componentValidations.firstName )
    ),
    'lastName': new FormControl(
        this.userProfile.lastName,
        this.applyRules( this.userProfile, 'lastName', componentValidations.lastName )
    ),
    'username': new FormControl(
        this.userProfile.username,
        this.applyRules( this.userProfile, 'username', componentValidations.username )
    ),
    'age': new FormControl(
        this.userProfile.age,
        this.applyRules( this.userProfile, 'age' )
    ),
    'gender': new FormControl(
        this.userProfile.gender,
        this.applyRules( this.userProfile, 'gender' )
    )
}); 
``` 

If combining domain and component-level validations is vadacl's primary purpose, then management of the validation error
messages is its secondary purpose.  Even though the same domain-level validation rules are applied, the error messages
for those rules can be altered via the component validation settings to fit the context.

vadacl also allows you to go in the other direction:  if you don't provide error message text in either the domain or 
component-level settings for a given validation method, the method will return its own generic error message as defined
in whatever Messages module is imported into the ValidationMethods class.

The Vadacl class also includes methods that assist with the task of displaying the validation error messages in the 
component template, eliminating the need to conditionally display different DOM elements for different validation errors:

```
<input id="firstName" type="text" class="form-control" formControlName="firstName">
<div *ngIf="pageReady && showErrors( profileForm.controls.firstName )" class="alert alert-danger">
    <ul>
        <li *ngFor="let error of getControlErrors( profileForm.controls.firstName )">
            {{error}}
        </li>
    </ul>
</div>
```

[Click to view admin profile form screenshot](docs/adminProfileErrors.png)

### Other Features

* In addition to wrapping and reusing the validation methods currently provided in Angular 2 (required, minLength, 
maxLength, pattern), vadacl also includes a withinLength validation for validating that a string length falls within a 
certain range. Creating additional validation methods is just a matter of following the examples of the current methods.

* If you don't want to write your components to extend the Vadacl class, you can declare the Vadacl class as a provider
in the appropriate Angular module(s) and inject it into your components like any other service.

* You can keep the regular expression patterns for particular validations (email addresses, website URLs, etc.) in the 
Patterns module incorporated in the vadacl architecture.


## Usage, Execution, and Testing Instructions

**Using vadacl in your project**

To use vadacl, simply download or checkout this repo, then copy the app/vadacl folder into your own project.

**Trying out vadacl**

This repo contains an Angular 2 application (currently Angular 2.1.1) with several demos that utilize vadacl.  So to try
out vadacl, download or checkout the repo, open a command prompt in the main project folder, run "npm install" to get 
the needed Node modules to run Angular, and run the application using "npm start."

Note that the demos display the validation errors based on the default configuration, meaning that the errors are not
displayed until the invalid field is marked as both dirty and touched (had and then lost focus).

**Testing vadacl**

The vadacl folder contains Jasmine unit tests for the Vadacl and ValidationMethod classes.  The repo includes packages 
and configuration files for running the tests via Karma. To execute the tests, open a command prompt in 
the main project folder, run "npm install" to get the needed Node modules, and then run "npm test".

## Release Notes

### 0.0.2

* Added unit tests for Vadacl and ValidationMethod classes.

### 0.0.1

* Initial release


## Feature Roadmap

Currently the roadmap for improving vadacl includes the following items:

* The addition of more validation methods.

* Adding the ability to set domain-level validation error messages in the Messages module to accommodate simple 
internationalization.